import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  label: string;
  value: string;
  onPress: () => void;
};

export default function SelectCard({
  label,
  value,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={styles.card}
        onPress={onPress}
      >
        <Text style={styles.value}>
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

  container:{
    marginBottom:20,
  },

  label:{
    marginBottom:8,
    fontWeight:"600",
    color:theme.colors.text,
  },

  card:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",

    backgroundColor:theme.colors.surface,

    padding:18,

    borderRadius:15,

    borderWidth:1,

    borderColor:theme.colors.border,
  },

  value:{
    fontSize:16,
    color:theme.colors.text,
  }

});