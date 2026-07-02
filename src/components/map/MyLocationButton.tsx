import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
};

export default function MyLocationButton({
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name="crosshairs-gps"
        size={28}
        color="#2563EB"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  container: {

    position: "absolute",

    bottom: 230,

    right: 18,

    width: 58,

    height: 58,

    borderRadius: 29,

    backgroundColor: "#FFF",

    justifyContent: "center",

    alignItems: "center",

    elevation: 12,

    shadowColor: "#000",

    shadowOpacity: .25,

    shadowRadius: 8,

    shadowOffset: {

      width: 0,

      height: 4,

    },

  },

});