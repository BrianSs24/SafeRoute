import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  onPress: () => void;
};

export default function ProfileOption({
  title,
  subtitle,
  icon,
  color = "#2563EB",
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${color}20`,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={color}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={26}
        color="#9CA3AF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    marginBottom: 14,

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

  },

  pressed: {

    transform: [
      {
        scale: 0.98,
      },
    ],

    opacity: 0.9,

  },

  iconContainer: {

    width: 52,

    height: 52,

    borderRadius: 26,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 16,

  },

  content: {

    flex: 1,

  },

  title: {

    fontSize: 17,

    fontWeight: "700",

    color: "#111827",

  },

  subtitle: {

    marginTop: 4,

    fontSize: 14,

    color: "#6B7280",

  },

});