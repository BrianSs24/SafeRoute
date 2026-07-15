import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileOption from "../../components/profile/ProfileOption";
import ProfileStats from "../../components/profile/ProfileStats";
import PageHeader from "../../components/common/PageHeader";
import {
  useAppSettings,
  useAppTheme,
} from "../../context/AppSettingsContext";
import { logout } from "../../services/AuthService";
import { loadProfile } from "../../viewmodels/profile/ProfileViewModel";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const { reloadFromProfile } = useAppSettings();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    reports: 0,
    verified: 0,
    reputation: 100,
  });
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");

  const fetchProfile = useCallback(async () => {
    const result = await loadProfile();

    if (result.success) {
      setProfile(result.profile);
      setStats(result.stats);
      setAuthEmail(result.authEmail);
    }

    setLoading(false);
  }, []);

  // Refresca datos al montar y cada vez que se vuelve a esta pantalla.
  useEffect(() => {
    const refresh = () => {
      setLoading(true);
      reloadFromProfile();
      fetchProfile();
    };

    refresh();

    const unsubscribe = navigation.addListener("focus", refresh);
    return unsubscribe;
  }, [navigation, fetchProfile, reloadFromProfile]);

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
      "Usuario"
    : "Usuario";

  const displayEmail =
    profile?.email || authEmail || "Sin correo registrado";

  /** Cierre de sesión con confirmación y signOut real de Firebase Auth. */
  function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Deseas salir de tu cuenta en este dispositivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/login");
            } catch {
              Alert.alert(
                "Error",
                "No fue posible cerrar la sesión. Inténtalo de nuevo."
              );
            }
          },
        },
      ]
    );
  }

  function handleAbout() {
    Alert.alert(
      "Acerca de SafeRoute",
      "SafeRoute v1.0\n\nAplicación de seguridad ciudadana para reportar incidentes y consultar rutas con mayor contexto de riesgo.\n\n© SafeRoute"
    );
  }

  if (loading && !profile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PageHeader title="Mi perfil" subtitle="Administra tu cuenta" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
      <PageHeader title="Mi perfil" subtitle="Administra tu cuenta" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchProfile}
            tintColor={theme.colors.primary}
          />
        }
      >
        <ProfileHeader
          name={displayName}
          email={displayEmail}
          image={profile?.photoURL}
          primaryColor={theme.colors.primary}
          primaryDarkColor={theme.colors.primaryDark}
        />

      <ProfileStats
        reports={stats.reports}
        verified={stats.verified}
        reputation={stats.reputation}
        surfaceColor={theme.colors.surface}
        primaryColor={theme.colors.primary}
        labelColor={theme.colors.textSecondary}
      />

      <View style={styles.section}>
        <ProfileOption
          title="Editar perfil"
          subtitle="Actualiza tu información personal"
          icon="account-edit"
          color={theme.colors.primary}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={() => router.push("/edit-profile")}
        />

        <ProfileOption
          title="Seguridad"
          subtitle="Contraseña y acceso a tu cuenta"
          icon="shield-lock"
          color={theme.colors.primary}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={() => router.push("/change-password")}
        />
      </View>

      <View style={styles.section}>
        <ProfileOption
          title="Mis reportes"
          subtitle="Consulta tu historial de incidentes"
          icon="clipboard-list"
          color={theme.colors.primary}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={() => router.push("/my-reports")}
        />

        <ProfileOption
          title="Configuración"
          subtitle="Apariencia, modo oscuro y temas"
          icon="cog"
          color={theme.colors.primary}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={() => router.push("/settings")}
        />

        <ProfileOption
          title="Acerca de SafeRoute"
          subtitle="Versión e información del producto"
          icon="information-outline"
          color={theme.colors.primary}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={handleAbout}
        />

        <ProfileOption
          title="Cerrar sesión"
          subtitle="Salir de tu cuenta de forma segura"
          icon="logout"
          color={theme.colors.danger}
          surfaceColor={theme.colors.surface}
          titleColor={theme.colors.text}
          subtitleColor={theme.colors.textSecondary}
          onPress={handleLogout}
        />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  section: {
    marginTop: 18,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
