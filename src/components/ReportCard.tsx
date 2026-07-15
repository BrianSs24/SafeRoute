import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  type: string;
  description: string;
  riskLevel: string;
  status: string;
  createdAt?: any;
  /** Abre el modal de edición con los datos de esta tarjeta. */
  onEdit?: () => void;
  /** Dispara el flujo de confirmación y borrado. */
  onDelete?: () => void;
};

const riskColor = {
  Bajo: "#22C55E",
  Medio: "#FACC15",
  Alto: "#EF4444",
};

const statusColor = {
  Pendiente: "#F59E0B",
  Revisado: "#3B82F6",
  Resuelto: "#22C55E",
};

function getIncidentIcon(type: string) {
  switch (type) {
    case "Robo":
      return "shield-alert";

    case "Asalto":
      return "account-alert-outline";

    case "Accidente":
      return "car-emergency";

    case "Acoso":
      return "account-cancel-outline";

    case "Vandalismo":
      return "hammer-wrench";

    case "Violencia":
      return "hand-back-right-outline";

    case "Desastre natural":
      return "weather-lightning-rainy";

    default:
      return "alert-circle-outline";
  }
}

function getIncidentColor(type: string, fallback: string) {
  switch (type) {
    case "Robo":
      return "#EF4444";

    case "Asalto":
      return "#F97316";

    case "Accidente":
      return "#F59E0B";

    case "Acoso":
      return "#8B5CF6";

    case "Vandalismo":
      return "#3B82F6";

    case "Violencia":
      return "#DC2626";

    case "Desastre natural":
      return "#06B6D4";

    default:
      return fallback;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pendiente":
      return "clock-outline";

    case "Revisado":
      return "eye-outline";

    case "Resuelto":
      return "check-circle-outline";

    default:
      return "information-outline";
  }
}

export default function ReportCard({
  type,
  description,
  riskLevel,
  status,
  createdAt,
  onEdit,
  onDelete,
}: Props) {
  const theme = useAppTheme();

  const date = createdAt?.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString(
        "es-DO"
      )
    : "Sin fecha";

  const accent = getIncidentColor(type, theme.colors.primary);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: accent + "18" },
          ]}
        >
          <MaterialCommunityIcons
            name={getIncidentIcon(type)}
            size={26}
            color={accent}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {type}
          </Text>

          <Text
            numberOfLines={2}
            style={[
              styles.description,
              { color: theme.colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                riskColor[riskLevel as keyof typeof riskColor] ??
                theme.colors.warning,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={14}
            color="white"
          />
          <Text style={styles.badgeText}>{riskLevel}</Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                statusColor[status as keyof typeof statusColor] ??
                theme.colors.textSecondary,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getStatusIcon(status)}
            size={14}
            color="white"
          />
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { borderTopColor: theme.colors.border },
        ]}
      >
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.date, { color: theme.colors.textSecondary }]}
          >
            {date}
          </Text>
        </View>

        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: theme.colors.soft,
                    borderColor: theme.colors.accentBorder,
                  },
                  pressed && styles.actionPressed,
                ]}
                onPress={onEdit}
                accessibilityRole="button"
                accessibilityLabel="Editar reporte"
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.actionLabel,
                    { color: theme.colors.primary },
                  ]}
                >
                  Editar
                </Text>
              </Pressable>
            )}

            {onDelete && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: theme.darkMode
                      ? "#3F1F1F"
                      : "#FEF2F2",
                    borderColor: theme.darkMode
                      ? "#7F1D1D"
                      : "#FECACA",
                  },
                  pressed && styles.actionPressed,
                ]}
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel="Eliminar reporte"
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color={theme.colors.danger}
                />
                <Text
                  style={[
                    styles.actionLabel,
                    { color: theme.colors.danger },
                  ]}
                >
                  Eliminar
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  headerText: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  description: {
    marginTop: 6,
    lineHeight: 21,
    fontSize: 14,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 12,
  },

  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 12,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  date: {
    marginLeft: 6,
    fontSize: 13,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },

  actionPressed: {
    opacity: 0.75,
  },

  actionLabel: {
    fontWeight: "700",
    fontSize: 13,
  },
});
