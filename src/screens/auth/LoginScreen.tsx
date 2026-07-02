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
import { theme } from "../../styles/theme";
import { loginUser } from "../../viewmodels/auth/LoginViewModel";

export default function LoginScreen() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onLogin = async () => {

    if (loading) return;

    Keyboard.dismiss();

    setLoading(true);

    const result = await loginUser(
      email,
      password
    );

    setLoading(false);

    if (result.success) {

      setEmail("");

      setPassword("");

      router.replace("/home");

    } else {

      Alert.alert(
        "Error",
        result.message
      );

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.logo}>
        SafeRoute
      </Text>

      <Text style={styles.subtitle}>
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

      <CustomButton
        title={
          loading
            ? "Iniciando sesión..."
            : "Iniciar sesión"
        }
        loading={loading}
        onPress={onLogin}
      />

      <Pressable
        disabled={loading}
        onPress={() =>
          router.push("/register")
        }
      >

        <Text style={styles.link}>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    fontSize: 16,
  },

  link: {
    marginTop: theme.spacing.lg,
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "600",
  },

});