import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

type Props = {
  incident: any;
  onPress: () => void;
  selected: boolean;
};

function getBackgroundColor(type: string) {
  switch (type) {
    case "Robo":
      return "#DC2626";

    case "Accidente":
      return "#EA580C";

    case "Acoso":
      return "#9333EA";

    case "Vandalismo":
      return "#4B5563";

    default:
      return "#2563EB";
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

export default function IncidentMarker({
  incident,
  onPress,
  selected,
}: Props) {
  return (
    <Marker
      coordinate={{
        latitude: Number(incident.latitude),
        longitude: Number(incident.longitude),
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      onPress={onPress}
    >
      <View
        style={[
    styles.marker,

    selected && {
        transform: [
            {
                scale: 1.25,
            },
        ],
    },

    {
        backgroundColor: getBackgroundColor(
            incident.type
        ),
    },
]}
      >
        <MaterialCommunityIcons
          name={getIcon(incident.type) as any}
          size={22}
          color="#FFF"
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 42,
    height: 42,
    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderColor: "#FFF",

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});