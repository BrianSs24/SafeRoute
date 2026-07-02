import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import ReportCard from "../../components/ReportCard";
import { getCurrentUser } from "../../services/AuthService";
import { theme } from "../../styles/theme";
import { loadMyReports } from "../../viewmodels/report/MyReportsViewModel";

export default function MyReportsScreen() {

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {

    const user = getCurrentUser();

    if (!user) return;

    const result = await loadMyReports(user.uid);

    if (result.success) {
      setReports(result.reports);
    }

  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Mis Reportes
      </Text>

      <Text style={styles.subtitle}>
        Aquí encontrarás todos los incidentes que has reportado.
      </Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (

          <ReportCard
  type={item.type}
  description={item.description}
  riskLevel={item.riskLevel}
  status={item.status}
  createdAt={item.createdAt}
/>

        )}
        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={80}
              color="#CFCFCF"
            />

            <Text style={styles.emptyTitle}>
              No hay reportes
            </Text>

            <Text style={styles.emptySubtitle}>
              Cuando envíes un incidente aparecerá aquí.
            </Text>

          </View>

        }
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 5,
    marginBottom: 20,
    fontSize: 15,
  },

  list: {
    paddingBottom: 30,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    color: theme.colors.textSecondary,
    paddingHorizontal: 20,
  },

});