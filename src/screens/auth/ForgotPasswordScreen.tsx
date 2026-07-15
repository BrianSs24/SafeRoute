import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import { useAppTheme } from "../../context/AppSettingsContext";
import { requestPasswordReset } from "../../viewmodels/auth/ForgotPasswordViewModel";

/**
 * Pantalla de recuperación de contraseña (Fase UI 4.5).
 *
 * Solo pide el correo y dispara sendPasswordResetEmail vía ViewModel.
 * Reutiliza PageHeader para volver al login sin inventar un header nuevo.
 */
export default function ForgotPasswordScreen() {
  const theme = useAppTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (loading) return;

    Keyboard.dismiss();
    setLoading(true);

    const result = await requestPasswordReset(email);

    setLoading(false);

    if (result.success) {
      Alert.alert("Enlace enviado", result.message, [
        {
          text: "Volver al inicio de sesión",
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    Alert.alert("Error", result.message);
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <PageHeader
        title="Recuperar contraseña"
        subtitle="Te enviaremos un enlace a tu correo"
      />

      <View
        style={[
          styles.content,
          { paddingHorizontal: theme.spacing.lg },
        ]}
      >
        <Text
          style={[
            styles.hint,
            { color: theme.colors.textSecondary },
          ]}
        >
          Escribe el correo con el que te registraste en SafeRoute.
        </Text>

        <CustomInput
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          value={email}
          onChangeText={setEmail}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        <CustomButton
          title={loading ? "Enviando..." : "Enviar enlace"}
          loading={loading}
          onPress={onSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingTop: 12,
  },

  hint: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
});
