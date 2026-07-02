import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onPress: () => void;
};

export default function LocationCard({
  latitude,
  longitude,
  onPress,
}: Props) {
  const hasLocation =
    latitude !== null && longitude !== null;

  return (
    <View style={styles.container}>

      <Text style={styles.label}>
        Ubicación
      </Text>

      <Pressable
        style={styles.card}
        onPress={onPress}
      >
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={theme.colors.primary}
        />

        <View style={{ flex: 1, marginLeft: 15 }}>

          <Text style={styles.title}>
            {hasLocation
              ? "Ubicación obtenida"
              : "No se ha seleccionado una ubicación"}
          </Text>

          {hasLocation && (
            <Text style={styles.subtitle}>
              Lat: {latitude?.toFixed(5)}

              {"\n"}

              Lng: {longitude?.toFixed(5)}
            </Text>
          )}

        </View>

      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    marginBottom:25,
  },

  label:{
    fontWeight:"600",
    marginBottom:8,
    color:theme.colors.text,
  },

  card:{
    backgroundColor:theme.colors.surface,
    borderRadius:15,
    padding:18,
    flexDirection:"row",
    alignItems:"center",

    borderWidth:1,
    borderColor:theme.colors.border,
  },

  title:{
    fontWeight:"700",
    color:theme.colors.text,
  },

  subtitle:{
    marginTop:5,
    color:theme.colors.textSecondary,
  }

});