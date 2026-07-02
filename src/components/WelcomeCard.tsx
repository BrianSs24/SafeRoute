import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  name: string;
};

export default function WelcomeCard({ name }: Props) {

  const hour = new Date().getHours();

  let greeting = "Buenos días";

  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes";
  } else if (hour >= 19 || hour < 6) {
    greeting = "Buenas noches";
  }

  return (

    <View style={styles.container}>

      <View style={styles.left}>

        <View style={styles.avatar}>

          <Text style={styles.initial}>
            {name.charAt(0).toUpperCase()}
          </Text>

        </View>

        <View style={styles.info}>

          <Text style={styles.greeting}>
            {greeting} 👋
          </Text>

          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.message}>
            Tu seguridad comienza aquí.
          </Text>

        </View>

      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.notification}
      >

        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color="white"
        />

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    backgroundColor: theme.colors.primary,

    borderRadius: 28,

    paddingHorizontal: 24,

    paddingVertical: 22,

    marginBottom: 28,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    elevation: 10,

    shadowColor: "#000",

    shadowOpacity: .18,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 6,
    },

  },

  left: {

    flexDirection: "row",

    alignItems: "center",

    flex: 1,

  },

  avatar: {

    width: 72,

    height: 72,

    borderRadius: 36,

    backgroundColor: "rgba(255,255,255,.18)",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 18,

  },

  initial: {

    color: "#FFF",

    fontSize: 30,

    fontWeight: "700",

  },

  info: {

    flex: 1,

  },

  greeting: {

    color: "rgba(255,255,255,.9)",

    fontSize: 15,

  },

  name: {

    marginTop: 3,

    color: "#FFF",

    fontWeight: "700",

    fontSize: 26,

  },

  message: {

    marginTop: 6,

    color: "rgba(255,255,255,.9)",

    fontSize: 15,

  },

  notification: {

    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: "rgba(255,255,255,.15)",

    justifyContent: "center",

    alignItems: "center",

  },

});