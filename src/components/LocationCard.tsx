import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  latitude: number | null;
  longitude: number | null;
  /** Líneas legibles (ciudad / sector / calle). Si null tras geocode, UI muestra fallback. */
  city?: string | null;
  sector?: string | null;
  street?: string | null;
  /** true cuando ya se intentó reverse geocode y no hubo dirección útil */
  addressUnavailable?: boolean;
  onPress: () => void;
};

/**
 * Tarjeta de ubicación del reporte.
 *
 * Por qué el cambio (Fase 4.5): Lat/Lng no son amigables para el usuario.
 * Seguimos recibiendo coordenadas (Firestore no cambia el esquema); solo
 * mejoramos la visualización con reverse geocoding.
 * Riesgo: si el geocoder falla, mostramos "Ubicación no disponible" sin
 * bloquear el envío (las coords internas siguen válidas).
 */
export default function LocationCard({
  latitude,
  longitude,
  city,
  sector,
  street,
  addressUnavailable = false,
  onPress,
}: Props) {
  const theme = useAppTheme();
  const hasCoords = latitude !== null && longitude !== null;

  const hasReadableAddress = Boolean(
    (city && city.trim()) ||
      (sector && sector.trim()) ||
      (street && street.trim())
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        Ubicación
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
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={theme.colors.primary}
        />

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {hasCoords
              ? "Ubicación obtenida"
              : "No se ha seleccionado una ubicación"}
          </Text>

          {hasCoords && hasReadableAddress && (
            <View style={styles.addressBlock}>
              {!!city?.trim() && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {city.trim()}
                </Text>
              )}
              {!!sector?.trim() && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {sector.trim()}
                </Text>
              )}
              {!!street?.trim() && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {street.trim()}
                </Text>
              )}
            </View>
          )}

          {hasCoords && !hasReadableAddress && addressUnavailable && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Ubicación no disponible
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
  },

  card: {
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  title: {
    fontWeight: "700",
  },

  addressBlock: {
    marginTop: 5,
    gap: 2,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
  },
});
