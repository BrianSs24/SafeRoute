import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  label: string;
  value: string;
  onPress: () => void;
};

export default function SelectCard({ label, value, onPress }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {label}
      </Text>

      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value || "Seleccionar"}
        </Text>

        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color={theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
  },

  value: {
    fontSize: 16,
  },
});
