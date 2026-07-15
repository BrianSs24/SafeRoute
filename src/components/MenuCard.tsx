import { Pressable, StyleSheet, Text } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  title: string;
  onPress: () => void;
};

export default function MenuCard({ title, onPress }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.radius.md,
          marginBottom: theme.spacing.md,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
