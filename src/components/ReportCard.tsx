import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  type: string;
  description: string;
  riskLevel: string;
  status: string;
  createdAt?: any;
};

const riskColor = {
  Bajo: "#22C55E",
  Medio: "#FACC15",
  Alto: "#EF4444",
};

const statusColor = {
  Pendiente: "#F59E0B",
  Revisado: "#3B82F6",
  Resuelto: "#22C55E",
};

function getIncidentIcon(type: string) {
  switch (type) {
    case "Robo":
      return "shield-alert";

    case "Asalto":
      return "account-alert-outline";

    case "Accidente":
      return "car-emergency";

    case "Acoso":
      return "account-cancel-outline";

    case "Vandalismo":
      return "hammer-wrench";

    case "Violencia":
      return "hand-back-right-outline";

    case "Desastre natural":
      return "weather-lightning-rainy";

    default:
      return "alert-circle-outline";
  }
}

function getIncidentColor(type: string) {
  switch (type) {
    case "Robo":
      return "#EF4444";

    case "Asalto":
      return "#F97316";

    case "Accidente":
      return "#F59E0B";

    case "Acoso":
      return "#8B5CF6";

    case "Vandalismo":
      return "#3B82F6";

    case "Violencia":
      return "#DC2626";

    case "Desastre natural":
      return "#06B6D4";

    default:
      return theme.colors.primary;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pendiente":
      return "clock-outline";

    case "Revisado":
      return "eye-outline";

    case "Resuelto":
      return "check-circle-outline";

    default:
      return "information-outline";
  }
}

export default function ReportCard({
  type,
  description,
  riskLevel,
  status,
  createdAt,
}: Props) {

  const date =
    createdAt?.seconds
      ? new Date(createdAt.seconds * 1000).toLocaleDateString("es-DO")
      : "Sin fecha";

  return (

    <View style={styles.card}>

      <View style={styles.header}>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: getIncidentColor(type) + "20",
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getIncidentIcon(type)}
            size={28}
            color={getIncidentColor(type)}
          />
        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.title}>
            {type}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </Text>

        </View>

      </View>

      <View style={styles.infoRow}>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                riskColor[riskLevel as keyof typeof riskColor],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color="white"
          />

          <Text style={styles.badgeText}>
            {riskLevel}
          </Text>

        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                statusColor[status as keyof typeof statusColor],
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getStatusIcon(status)}
            size={16}
            color="white"
          />

          <Text style={styles.badgeText}>
            {status}
          </Text>

        </View>

      </View>

      <View style={styles.footer}>

        <View style={styles.dateRow}>

          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={18}
            color="#777"
          />

          <Text style={styles.date}>
            {date}
          </Text>

        </View>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },

  description: {
    marginTop: 6,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 12,
  },

  badgeText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 6,
  },

  footer: {
    marginTop: 18,

    borderTopWidth: 1,

    borderTopColor: "#EEEEEE",

    paddingTop: 14,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  date: {
    marginLeft: 6,
    color: "#777",
    fontSize: 14,
  },

});