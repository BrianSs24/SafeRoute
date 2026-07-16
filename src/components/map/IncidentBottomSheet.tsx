import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "../../context/AppSettingsContext";

type Props = {
  incident: any | null;
  onClose: () => void;
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
  onClose,
}: Props) {

  const theme = useAppTheme();

  if (!incident) return null;

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.surface,
        },
      ]}
    >

      <View
        style={[
          styles.handle,
          {
            backgroundColor:
              theme.colors.border,
          },
        ]}
      />

      <View style={styles.header}>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                getColor(
                  incident.riskLevel
                ),
            },
          ]}
        >

          <MaterialCommunityIcons
            name={
              getIcon(
                incident.type
              ) as any
            }
            size={32}
            color="#FFF"
          />

        </View>

        <View style={{ flex: 1 }}>

          <Text
            style={[
              styles.title,
              {
                color:
                  theme.colors.text,
              },
            ]}
          >
            {incident.type}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  getColor(
                    incident.riskLevel
                  ),
              },
            ]}
          >

            <Text
              style={styles.badgeText}
            >
              Riesgo {incident.riskLevel}
            </Text>

          </View>

        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >

          <MaterialCommunityIcons
            name="close"
            size={24}
            color={theme.colors.text}
          />

        </TouchableOpacity>

      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              theme.colors.mutedSurface,
          },
        ]}
      >

        <View style={styles.row}>

          <MaterialCommunityIcons
            name="text-box-outline"
            size={20}
            color={theme.colors.primary}
          />

          <Text
            style={[
              styles.info,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            {incident.description}
          </Text>

        </View>

        <View style={styles.row}>

          <MaterialCommunityIcons
            name="check-decagram"
            size={20}
            color={theme.colors.success}
          />

          <Text
            style={[
              styles.info,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            Estado: {incident.status}
          </Text>

        </View>

        {incident.createdAt && (

          <View style={styles.row}>

            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={
                theme.colors.textSecondary
              }
            />

            <Text
              style={[
                styles.info,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              {new Date(
                incident.createdAt
              ).toLocaleString()}
            </Text>

          </View>

        )}

      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              theme.colors.primary,
          },
        ]}
      >

        <MaterialCommunityIcons
          name="navigation"
          size={22}
          color="#FFF"
        />

        <Text
          style={styles.buttonText}
        >
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

  closeButton: {

    width: 40,

    height: 40,

    borderRadius: 20,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 10,

  },

  card: {

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

    lineHeight: 22,

  },

  button: {

    marginTop: 20,

    height: 54,

    borderRadius: 16,

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