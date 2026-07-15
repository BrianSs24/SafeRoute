import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
};

export default function ActionCard({
  title,
  description,
  icon,
  onPress,
}: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.soft },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={34}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={theme.colors.textSecondary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
  },

  description: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },

  arrowContainer: {
    marginLeft: 12,
  },

  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});
