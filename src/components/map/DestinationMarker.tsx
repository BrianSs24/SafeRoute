import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

type Props = {
  latitude: number;
  longitude: number;
};

export default function DestinationMarker({
  latitude,
  longitude,
}: Props) {
  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      anchor={{
        x: 0.5,
        y: 1,
      }}
    >
      <View style={styles.shadow}>

        <View style={styles.marker}>

          <MaterialCommunityIcons
            name="map-marker"
            size={32}
            color="#2563EB"
          />

        </View>

      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({

  shadow: {

    shadowColor: "#000",

    shadowOpacity: .20,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 10,

  },

  marker: {

    width: 52,

    height: 52,

    borderRadius: 26,

    backgroundColor: "#FFF",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 2,

    borderColor: "#2563EB",

  },

});