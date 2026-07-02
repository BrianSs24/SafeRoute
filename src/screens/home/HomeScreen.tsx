import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ActionCard from "../../components/ActionCard";
import CustomButton from "../../components/CustomButton";
import WelcomeCard from "../../components/WelcomeCard";
import { logout } from "../../services/AuthService";
import { theme } from "../../styles/theme";

export default function HomeScreen() {

  const handleLogout = async () => {

    await logout();

    router.replace("/login");

  };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <WelcomeCard name="Brian" />

      <View style={styles.securityCard}>

        <View>

          <Text style={styles.securityTitle}>
            Estado de seguridad
          </Text>

          <Text style={styles.securitySubtitle}>
            Tu zona actualmente presenta un riesgo bajo.
          </Text>

        </View>

        <View style={styles.statusBadge}>

          <Text style={styles.statusText}>
            🟢 Seguro
          </Text>

        </View>

      </View>

      <Text style={styles.sectionTitle}>
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

        <Text style={styles.accountTitle}>
          Cuenta
        </Text>

        <CustomButton
          title="Cerrar sesión"
          onPress={handleLogout}
        />

      </View>

      <Text style={styles.version}>
        SafeRoute v1.0
      </Text>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  securityCard: {

    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 20,

    marginBottom: 28,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    elevation: 6,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

  },

  securityTitle: {

    fontSize: 18,

    fontWeight: "700",

    color: theme.colors.text,

  },

  securitySubtitle: {

    marginTop: 6,

    fontSize: 14,

    color: "#6B7280",

    lineHeight: 20,

    width: 190,

  },

  statusBadge: {

    backgroundColor: "#DCFCE7",

    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 20,

  },

  statusText: {

    color: "#166534",

    fontWeight: "700",

    fontSize: 14,

  },

  sectionTitle: {

    fontSize: 22,

    fontWeight: "700",

    color: theme.colors.text,

    marginBottom: 18,

  },

  accountSection: {

    marginTop: 16,

  },

  accountTitle: {

    fontSize: 19,

    fontWeight: "700",

    marginBottom: 14,

    color: theme.colors.text,

  },

  version: {

    textAlign: "center",

    marginTop: 35,

    color: "#9CA3AF",

    fontSize: 13,

  },

});