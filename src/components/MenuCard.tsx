import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  title: string;
  onPress: () => void;
};

export default function MenuCard({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  card: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,

    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },

});