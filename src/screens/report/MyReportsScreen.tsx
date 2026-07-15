import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import OptionModal from "../../components/OptionModal";
import ReportCard from "../../components/ReportCard";
import RiskSelector from "../../components/RiskSelector";
import SelectCard from "../../components/SelectCard";
import PageHeader from "../../components/common/PageHeader";
import { INCIDENT_TYPES } from "../../constants/incidentTypes";
import { useAppTheme } from "../../context/AppSettingsContext";
import { getCurrentUser } from "../../services/AuthService";
import {
  deleteMyReport,
  loadMyReports,
  updateMyReport,
} from "../../viewmodels/report/MyReportsViewModel";

// Habilita animaciones de layout en Android (aparición/eliminación de cards).
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ReportItem = {
  id: string;
  type: string;
  description: string;
  riskLevel: string;
  status: string;
  createdAt?: any;
  latitude?: number;
  longitude?: number;
  userId?: string;
};

export default function MyReportsScreen() {
  const theme = useAppTheme();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  /** Separado de loading: el pull-to-refresh no debe montar pantalla completa de spinner. */
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<ReportItem | null>(null);

  // Estado del formulario de edición (ubicación excluida a propósito).
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRiskLevel, setEditRiskLevel] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);

  useEffect(() => {
    loadReports(false);
  }, []);

  /**
   * Recarga reportes desde Firestore.
   * @param isPullRefresh - si true, usa indicador nativo sin vaciar la lista.
   */
  async function loadReports(isPullRefresh: boolean) {
    const user = getCurrentUser();

    if (!user) {
      setReports([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const result = await loadMyReports(user.uid);

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    if (result.success) {
      setReports(result.reports as ReportItem[]);
    } else {
      setReports([]);
      Alert.alert("Error", "No fue posible cargar tus reportes.");
    }

    setLoading(false);
    setRefreshing(false);
  }

  /** Prefill del modal con los datos del reporte seleccionado. */
  function openEditModal(report: ReportItem) {
    setSelectedReport(report);
    setEditType(report.type ?? "");
    setEditDescription(report.description ?? "");
    setEditRiskLevel(report.riskLevel ?? "");
    setEditVisible(true);
  }

  function closeEditModal() {
    if (saving) return;

    setEditVisible(false);
    setSelectedReport(null);
    setShowTypeModal(false);
  }

  /** Valida y persiste solo type/description/riskLevel en Firestore. */
  async function handleSaveEdit() {
    if (!selectedReport) return;

    if (!editType) {
      Alert.alert("Error", "Selecciona el tipo de incidente.");
      return;
    }

    if (!editDescription.trim()) {
      Alert.alert("Error", "Describe el incidente.");
      return;
    }

    if (!editRiskLevel) {
      Alert.alert("Error", "Selecciona el nivel de riesgo.");
      return;
    }

    setSaving(true);

    const result = await updateMyReport(selectedReport.id, {
      type: editType,
      description: editDescription.trim(),
      riskLevel: editRiskLevel as "Bajo" | "Medio" | "Alto",
    });

    setSaving(false);

    if (!result.success) {
      Alert.alert(
        "Error",
        result.message ?? "No fue posible actualizar el reporte."
      );
      return;
    }

    // Actualización optimista local + cierre del modal sin recargar la pantalla.
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setReports((prev) =>
      prev.map((item) =>
        item.id === selectedReport.id
          ? {
              ...item,
              type: editType,
              description: editDescription.trim(),
              riskLevel: editRiskLevel,
            }
          : item
      )
    );

    setEditVisible(false);
    setSelectedReport(null);
  }

  /**
   * Confirmación obligatoria antes de borrar.
   * Solo elimina el documento indicado; el resto de la lista se mantiene.
   */
  function confirmDelete(report: ReportItem) {
    Alert.alert(
      "Eliminar reporte",
      "¿Estás seguro de que deseas eliminar este reporte?\n\nEsta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleDelete(report.id),
        },
      ]
    );
  }

  async function handleDelete(incidentId: string) {
    const result = await deleteMyReport(incidentId);

    if (!result.success) {
      Alert.alert(
        "Error",
        result.message ??
          "No fue posible eliminar el reporte. Inténtalo de nuevo."
      );
      return;
    }

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setReports((prev) =>
      prev.filter((item) => item.id !== incidentId)
    );
  }

  function renderHeader() {
    return (
      <View style={styles.listHeader}>
        {!loading && reports.length > 0 && (
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: theme.colors.soft,
                borderColor: theme.colors.accentBorder,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.countText,
                { color: theme.colors.primary },
              ]}
            >
              {reports.length}{" "}
              {reports.length === 1 ? "reporte" : "reportes"}
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIconWrap,
            {
              backgroundColor: theme.colors.soft,
              borderColor: theme.colors.accentBorder,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={52}
            color={theme.colors.primary}
          />
        </View>

        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          Aún no tienes reportes
        </Text>

        <Text
          style={[
            styles.emptySubtitle,
            { color: theme.colors.textSecondary },
          ]}
        >
          Cuando reportes un incidente en tu zona, aparecerá aquí para
          que puedas consultarlo o actualizarlo.
        </Text>

        <View style={styles.emptyButton}>
          <CustomButton
            title="Reportar incidente"
            onPress={() => router.push("/report-incident")}
          />
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PageHeader
          title="Mis Reportes"
          subtitle="Consulta, edita o elimina los incidentes que has reportado."
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.textSecondary },
            ]}
          >
            Cargando tus reportes...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PageHeader
        title="Mis Reportes"
        subtitle="Consulta, edita o elimina los incidentes que has reportado."
      />

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.list,
          reports.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadReports(true)}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <ReportCard
            type={item.type}
            description={item.description}
            riskLevel={item.riskLevel}
            status={item.status}
            createdAt={item.createdAt}
            onEdit={() => openEditModal(item)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={renderEmpty}
      />

      {/* Modal de edición in-place: no navega a otra pantalla. */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <KeyboardAvoidingView
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={styles.modalDismiss}
            onPress={closeEditModal}
          />

          <View
            style={[
              styles.modalSheet,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: theme.colors.border },
              ]}
            />

            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.colors.primary },
                ]}
              >
                Editar reporte
              </Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Actualiza la información del incidente. La ubicación no
                se modifica.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalContent}
            >
              <SelectCard
                label="Tipo de incidente"
                value={editType}
                onPress={() => setShowTypeModal(true)}
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: theme.colors.text },
                ]}
              >
                Descripción
              </Text>
              <CustomInput
                placeholder="Describe el incidente"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
                style={styles.descriptionInput}
                editable={!saving}
              />

              <RiskSelector
                value={editRiskLevel}
                onChange={setEditRiskLevel}
              />

              <CustomButton
                title={saving ? "Guardando..." : "Guardar cambios"}
                loading={saving}
                onPress={handleSaveEdit}
              />

              <Pressable
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme.colors.mutedSurface },
                ]}
                onPress={closeEditModal}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Cancelar
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <OptionModal
        visible={showTypeModal}
        title="Selecciona el tipo de incidente"
        options={INCIDENT_TYPES}
        onClose={() => setShowTypeModal(false)}
        onSelect={setEditType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 8,
  },

  listHeader: {
    paddingBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
  },

  countBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 8,
  },

  countText: {
    fontWeight: "700",
    fontSize: 13,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  listEmpty: {
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 15,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },

  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  emptyButton: {
    width: "100%",
    marginTop: 28,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalDismiss: {
    flex: 1,
  },

  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
  },

  modalHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    marginTop: 12,
    marginBottom: 8,
  },

  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },

  fieldLabel: {
    marginBottom: 8,
    fontWeight: "600",
  },

  descriptionInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
