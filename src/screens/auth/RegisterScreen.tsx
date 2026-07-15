import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useAppTheme } from "../../context/AppSettingsContext";
import { registerUser } from "../../viewmodels/auth/RegisterViewModel";

export default function RegisterScreen() {
  const theme = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const onRegister = async () => {
    if (loading) return;

    Keyboard.dismiss();

    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const result = await registerUser(email, password);

    setLoading(false);

    if (result.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.replace("/home");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.logo,
          {
            color: theme.colors.primary,
            marginBottom: theme.spacing.xl,
          },
        ]}
      >
        Crear cuenta
      </Text>

      <CustomInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        placeholder="Contraseña"
        secureTextEntry
        editable={!loading}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
      />

      <CustomInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        editable={!loading}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (passwordError) setPasswordError("");
        }}
        returnKeyType="done"
        onSubmitEditing={onRegister}
      />

      {passwordError !== "" && (
        <Text style={[styles.error, { color: theme.colors.danger }]}>
          {passwordError}
        </Text>
      )}

      <CustomButton
        title={loading ? "Registrando..." : "Registrarse"}
        loading={loading}
        onPress={onRegister}
      />

      <Pressable disabled={loading} onPress={() => router.back()}>
        <Text
          style={[
            styles.link,
            {
              marginTop: theme.spacing.lg,
              color: theme.colors.primary,
            },
          ]}
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },

  error: {
    marginBottom: 14,
    marginTop: -6,
    marginLeft: 4,
    fontSize: 14,
  },

  link: {
    textAlign: "center",
    fontWeight: "600",
  },
});
