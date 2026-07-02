import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <View style={styles.container}>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#111827"
        />
      </Pressable>

      <View style={styles.textContainer}>

        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 20,

    paddingTop: 60,

    paddingBottom: 20,

    backgroundColor: "#FFFFFF",

  },

  backButton: {

    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 16,

  },

  textContainer: {

    flex: 1,

  },

  title: {

    fontSize: 24,

    fontWeight: "700",

    color: "#111827",

  },

  subtitle: {

    marginTop: 4,

    fontSize: 15,

    color: "#6B7280",

  },

});