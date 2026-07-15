import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useAppTheme } from "../../context/AppSettingsContext";
import { loginUser } from "../../viewmodels/auth/LoginViewModel";

/** Ancho responsivo del logo: proporciones sin deformar (contain). */
const LOGO_SIZE = Math.min(
  180,
  Math.max(120, Math.round(Dimensions.get("window").width * 0.38))
);

export default function LoginScreen() {
  const theme = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (loading) return;

    Keyboard.dismiss();

    setLoading(true);

    const result = await loginUser(email, password);

    setLoading(false);

    if (result.success) {
      setEmail("");
      setPassword("");
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
      {/* Branding oficial SafeRoute (Fase UI 4.6). No altera el flujo de login. */}
      <Image
        source={require("../../../assets/images/saferoute-logo.png")}
        style={[
          styles.logoImage,
          {
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            marginBottom: theme.spacing.sm,
          },
        ]}
        resizeMode="contain"
        accessibilityLabel="SafeRoute"
      />

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          },
        ]}
      >
        Tu seguridad comienza aquí
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
        onChangeText={setPassword}
        returnKeyType="done"
        onSubmitEditing={onLogin}
      />

      {/* Enlace discreto a recuperación; no altera el formulario de login. */}
      <Pressable
        disabled={loading}
        onPress={() => router.push("/forgot-password")}
        hitSlop={8}
      >
        <Text
          style={[
            styles.forgotLink,
            {
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.md,
            },
          ]}
        >
          ¿Has olvidado tu contraseña?
        </Text>
      </Pressable>

      <CustomButton
        title={loading ? "Iniciando sesión..." : "Iniciar sesión"}
        loading={loading}
        onPress={onLogin}
      />

      <Pressable
        disabled={loading}
        onPress={() => router.push("/register")}
      >
        <Text
          style={[
            styles.link,
            {
              marginTop: theme.spacing.lg,
              color: theme.colors.primary,
            },
          ]}
        >
          ¿No tienes una cuenta? Regístrate
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

  logoImage: {
    alignSelf: "center",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    fontWeight: "600",
  },

  forgotLink: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
  },
});
