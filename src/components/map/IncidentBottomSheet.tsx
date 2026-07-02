import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  incident: any | null;
};

function getColor(risk: string) {
  switch (risk) {
    case "Alto":
      return "#EF4444";
    case "Medio":
      return "#F59E0B";
    default:
      return "#22C55E";
  }
}

function getIcon(type: string) {
  switch (type) {
    case "Robo":
      return "shield-alert";

    case "Accidente":
      return "car-emergency";

    case "Acoso":
      return "account-alert";

    case "Vandalismo":
      return "hammer";

    default:
      return "alert-circle";
  }
}

export default function IncidentBottomSheet({
  incident,
}: Props) {

  if (!incident) return null;

  return (

    <View style={styles.container}>

      <View style={styles.handle} />

      <View style={styles.header}>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: getColor(
                incident.riskLevel
              ),
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getIcon(incident.type) as any}
            size={32}
            color="#FFF"
          />
        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.title}>
            {incident.type}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: getColor(
                  incident.riskLevel
                ),
              },
            ]}
          >
            <Text style={styles.badgeText}>
              Riesgo {incident.riskLevel}
            </Text>
          </View>

        </View>

      </View>

      <View style={styles.card}>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="text-box-outline"
            size={20}
            color="#2563EB"
          />

          <Text style={styles.info}>
            {incident.description}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="check-decagram"
            size={20}
            color="#22C55E"
          />

          <Text style={styles.info}>
            Estado: {incident.status}
          </Text>
        </View>

        {incident.createdAt && (

          <View style={styles.row}>

            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#6B7280"
            />

            <Text style={styles.info}>
              {new Date(
                incident.createdAt
              ).toLocaleString()}
            </Text>

          </View>

        )}

      </View>

      <TouchableOpacity style={styles.button}>

        <MaterialCommunityIcons
          name="navigation"
          size={22}
          color="#FFF"
        />

        <Text style={styles.buttonText}>
          Ir hacia aquí
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    position: "absolute",

    left: 16,
    right: 16,
    bottom: 16,

    backgroundColor: "#FFFFFF",

    borderRadius: 28,

    padding: 22,

    elevation: 18,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

  },

  handle: {

    width: 52,
    height: 5,

    borderRadius: 3,

    backgroundColor: "#D1D5DB",

    alignSelf: "center",

    marginBottom: 20,

  },

  header: {

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 18,

  },

  iconContainer: {

    width: 62,
    height: 62,

    borderRadius: 31,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 16,

  },

  title: {

    fontSize: 23,

    fontWeight: "700",

    color: "#111827",

    marginBottom: 8,

  },

  badge: {

    alignSelf: "flex-start",

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 30,

  },

  badgeText: {

    color: "#FFF",

    fontWeight: "700",

    fontSize: 13,

  },

  card: {

    backgroundColor: "#F9FAFB",

    borderRadius: 18,

    padding: 16,

  },

  row: {

    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: 14,

  },

  info: {

    flex: 1,

    marginLeft: 12,

    fontSize: 15,

    color: "#374151",

    lineHeight: 22,

  },

  button: {

    marginTop: 20,

    height: 54,

    borderRadius: 16,

    backgroundColor: "#2563EB",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

  },

  buttonText: {

    color: "#FFF",

    fontSize: 16,

    fontWeight: "700",

    marginLeft: 10,

  },

});