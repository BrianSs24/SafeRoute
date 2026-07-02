import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftSection}>

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={34}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>
        </View>

      </View>

      <View style={styles.arrowContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color="#B8C1CC"
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

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    paddingVertical: 20,

    paddingHorizontal: 18,

    marginBottom: 18,

    elevation: 7,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
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

    backgroundColor: "#EEF5FF",

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

    color: theme.colors.text,

  },

  description: {

    marginTop: 5,

    color: "#7B8794",

    fontSize: 14,

    lineHeight: 20,

  },

  arrowContainer: {

    marginLeft: 12,

  },

  pressed: {

    transform: [
      {
        scale: 0.97,
      },
    ],

    opacity: 0.9,

  },

});