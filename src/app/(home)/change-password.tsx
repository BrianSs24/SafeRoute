import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import { useAppTheme } from "../../context/AppSettingsContext";
import { changeUserPassword } from "../../viewmodels/profile/ChangePasswordViewModel";

export default function ChangePasswordScreen() {
  const theme = useAppTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const result = await changeUserPassword(
      currentPassword,
      newPassword,
      confirmPassword
    );

    setLoading(false);

    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }

    Alert.alert(
      "Contraseña actualizada",
      "Tu contraseña se cambió correctamente.",
      [
        {
          text: "Aceptar",
          onPress: () => router.back(),
        },
      ]
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
        title="Seguridad"
        subtitle="Actualiza la contraseña de tu cuenta"
        backgroundColor={theme.colors.surface}
        titleColor={theme.colors.text}
        subtitleColor={theme.colors.textSecondary}
        iconColor={theme.colors.text}
        backBackgroundColor={theme.colors.mutedSurface}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.colors.soft,
                borderColor: theme.colors.accentBorder,
              },
            ]}
          >
            <Text
              style={[styles.infoTitle, { color: theme.colors.primary }]}
            >
              Recomendación de seguridad
            </Text>
            <Text
              style={[
                styles.infoText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Usa al menos 6 caracteres y evita reutilizar contraseñas de
              otros servicios.
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Contraseña actual
          </Text>
          <CustomInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Contraseña actual"
            secureTextEntry
            editable={!loading}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Nueva contraseña
          </Text>
          <CustomInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nueva contraseña"
            secureTextEntry
            editable={!loading}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Confirmar nueva contraseña
          </Text>
          <CustomInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
            secureTextEntry
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <CustomButton
            title={loading ? "Actualizando..." : "Cambiar contraseña"}
            loading={loading}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
});
