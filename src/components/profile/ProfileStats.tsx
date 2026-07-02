import { StyleSheet, Text, View } from "react-native";

type Props = {
  reports: number;
  verified: number;
  reputation: number;
};

export default function ProfileStats({
  reports,
  verified,
  reputation,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.number}>
          {reports}
        </Text>

        <Text style={styles.label}>
          Reportes
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.number}>
          {verified}
        </Text>

        <Text style={styles.label}>
          Verificados
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.number}>
          {reputation}%
        </Text>

        <Text style={styles.label}>
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

  },

  card: {

    flex: 1,

    backgroundColor: "#FFFFFF",

    marginHorizontal: 5,

    borderRadius: 18,

    paddingVertical: 18,

    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

  },

  number: {

    fontSize: 26,

    fontWeight: "700",

    color: "#2563EB",

  },

  label: {

    marginTop: 6,

    color: "#6B7280",

    fontSize: 14,

    fontWeight: "600",

  },

});