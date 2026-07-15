import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import ActionCard from "../../components/ActionCard";
import CustomButton from "../../components/CustomButton";
import WelcomeCard from "../../components/WelcomeCard";
import {
  useAppSettings,
  useAppTheme,
} from "../../context/AppSettingsContext";
import { logout } from "../../services/AuthService";
import { loadHomeHeader } from "../../viewmodels/home/HomeViewModel";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const { reloadFromProfile } = useAppSettings();

  const [initialLoad, setInitialLoad] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshHeader = useCallback(async () => {
    const result = await loadHomeHeader();

    if (result.success) {
      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      );
      setFirstName(result.firstName);
      setPhotoURL(result.photoURL);
      setUnreadCount(result.unreadCount);
    }

    setInitialLoad(false);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      reloadFromProfile();
      refreshHeader();
    };

    onFocus();

    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
  }, [navigation, refreshHeader, reloadFromProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (initialLoad) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[
            styles.loadingText,
            { color: theme.colors.textSecondary },
          ]}
        >
          Cargando tu inicio...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <WelcomeCard
        name={firstName || "Usuario"}
        photoURL={photoURL}
        unreadCount={unreadCount}
        onPressNotifications={() => router.push("/notifications")}
      />

      {/* Badge Mapa: atajo al mapa seguro (/routes). ActionCard ya navega igual. */}
      <Pressable
        style={[
          styles.securityCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => router.push("/routes")}
      >
        <View style={styles.securityTextWrap}>
          <Text
            style={[styles.securityTitle, { color: theme.colors.text }]}
          >
            Estado de seguridad
          </Text>
          <Text
            style={[
              styles.securitySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Consulta el mapa para conocer incidentes reportados cerca de
            ti.
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: theme.colors.soft,
              borderColor: theme.colors.accentBorder,
            },
          ]}
        >
          <Text
            style={[styles.statusText, { color: theme.colors.primary }]}
          >
            Mapa
          </Text>
        </View>
      </Pressable>

      <Text
        style={[styles.sectionTitle, { color: theme.colors.text }]}
      >
        Acciones rápidas
      </Text>

      <ActionCard
        title="Ver mapa seguro"
        description="Consulta rutas seguras e incidentes cercanos."
        icon="map-marker-radius"
        onPress={() => router.push("/routes")}
      />

      <ActionCard
        title="Reportar incidente"
        description="Ayuda a la comunidad reportando situaciones de riesgo."
        icon="alert-circle"
        onPress={() => router.push("/report-incident")}
      />

      <ActionCard
        title="Mis reportes"
        description="Consulta el historial de incidentes reportados."
        icon="clipboard-list"
        onPress={() => router.push("/my-reports")}
      />

      <ActionCard
        title="Mi perfil"
        description="Administra tu información personal."
        icon="account-circle"
        onPress={() => router.push("/profile")}
      />

      <View style={styles.accountSection}>
        <Text
          style={[styles.accountTitle, { color: theme.colors.text }]}
        >
          Cuenta
        </Text>
        <CustomButton title="Cerrar sesión" onPress={handleLogout} />
      </View>

      <Text
        style={[styles.version, { color: theme.colors.textSecondary }]}
      >
        SafeRoute v1.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  securityCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  securityTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  securityTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  securitySubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  accountSection: {
    marginTop: 16,
  },

  accountTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 14,
  },

  version: {
    textAlign: "center",
    marginTop: 35,
    fontSize: 13,
  },
});
