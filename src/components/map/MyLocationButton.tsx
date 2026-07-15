import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useAppTheme } from "../../context/AppSettingsContext";

type Props = {
  onPress: () => void;
};

export default function MyLocationButton({ onPress }: Props) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name="crosshairs-gps"
        size={28}
        color={theme.colors.primary}
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
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
