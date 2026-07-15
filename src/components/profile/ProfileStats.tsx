import { StyleSheet, Text, View } from "react-native";

type Props = {
  reports: number;
  verified: number;
  reputation: number;
  surfaceColor?: string;
  primaryColor?: string;
  labelColor?: string;
};

export default function ProfileStats({
  reports,
  verified,
  reputation,
  surfaceColor = "#FFFFFF",
  primaryColor = "#2563EB",
  labelColor = "#6B7280",
}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.number, { color: primaryColor }]}>
          {reports}
        </Text>
        <Text style={[styles.label, { color: labelColor }]}>
          Reportes
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.number, { color: primaryColor }]}>
          {verified}
        </Text>
        <Text style={[styles.label, { color: labelColor }]}>
          Verificados
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.number, { color: primaryColor }]}>
          {reputation}%
        </Text>
        <Text style={[styles.label, { color: labelColor }]}>
          Confianza
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  card: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  number: {
    fontSize: 26,
    fontWeight: "700",
  },

  label: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
