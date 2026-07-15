import * as Location from "expo-location";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import LocationCard from "../../components/LocationCard";
import OptionModal from "../../components/OptionModal";
import RiskSelector from "../../components/RiskSelector";
import SelectCard from "../../components/SelectCard";
import PageHeader from "../../components/common/PageHeader";
import { INCIDENT_TYPES } from "../../constants/incidentTypes";
import { useAppTheme } from "../../context/AppSettingsContext";
import { getCurrentUser } from "../../services/AuthService";
import { saveIncident } from "../../viewmodels/report/ReportIncidentViewModel";

/**
 * Normaliza el resultado de reverseGeocodeAsync a Ciudad / Sector / Calle.
 *
 * Por qué: los campos de expo-location varían por plataforma y país (RD).
 * Elegimos aliases comunes sin añadir librerías nuevas (SDK 56).
 * Riesgo: puede quedar vacío; la UI muestra "Ubicación no disponible"
 * pero lat/lng siguen listos para Firestore.
 */
function mapReverseGeocode(place: Location.LocationGeocodedAddress): {
  city: string;
  sector: string;
  street: string;
} {
  // Campos opcionales del placemark; leemos con casts suaves para no asumir API.
  const raw = place as Location.LocationGeocodedAddress & {
    subLocality?: string | null;
    formattedAddress?: string | null;
  };

  const city =
    raw.city?.trim() ||
    raw.subregion?.trim() ||
    raw.region?.trim() ||
    "";

  const sector =
    raw.district?.trim() ||
    raw.subLocality?.trim() ||
    raw.name?.trim() ||
    "";

  const streetNumber = raw.streetNumber?.trim() || "";
  const streetName = raw.street?.trim() || "";
  const street =
    [streetName, streetNumber].filter(Boolean).join(" ").trim() ||
    raw.formattedAddress?.trim() ||
    "";

  return { city, sector, street };
}

export default function ReportIncidentScreen() {
  const theme = useAppTheme();

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [addressUnavailable, setAddressUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Debes permitir el acceso a la ubicación."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    // Persistencia Firestore sigue usando solo lat/lng (esquema intacto).
    setLatitude(lat);
    setLongitude(lng);

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      const first = results[0];

      if (!first) {
        setCity(null);
        setSector(null);
        setStreet(null);
        setAddressUnavailable(true);
        return;
      }

      const mapped = mapReverseGeocode(first);
      const hasAny =
        Boolean(mapped.city) ||
        Boolean(mapped.sector) ||
        Boolean(mapped.street);

      setCity(mapped.city || null);
      setSector(mapped.sector || null);
      setStreet(mapped.street || null);
      setAddressUnavailable(!hasAny);
    } catch {
      // Geocoder falló; no bloqueamos el reporte: coords ya están.
      setCity(null);
      setSector(null);
      setStreet(null);
      setAddressUnavailable(true);
    }
  };

  const handleSubmit = async () => {
    if (!type) {
      Alert.alert("Error", "Selecciona el tipo de incidente.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Describe el incidente.");
      return;
    }

    if (!riskLevel) {
      Alert.alert("Error", "Selecciona el nivel de riesgo.");
      return;
    }

    if (latitude === null || longitude === null) {
      Alert.alert("Error", "Obtén tu ubicación.");
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    setLoading(true);

    const result = await saveIncident({
      type,
      description,
      riskLevel: riskLevel as "Bajo" | "Medio" | "Alto",
      latitude,
      longitude,
      userId: user.uid,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert("Éxito", "Reporte enviado correctamente.");

      setType("");
      setDescription("");
      setRiskLevel("");
      setLatitude(null);
      setLongitude(null);
      setCity(null);
      setSector(null);
      setStreet(null);
      setAddressUnavailable(false);
    } else {
      Alert.alert("Error", "No fue posible guardar el reporte.");
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* PageHeader reutiliza ← con router.back(); evita el botón Volver duplicado. */}
      <PageHeader
        title="Reportar incidente"
        subtitle="Completa la información del incidente."
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SelectCard
          label="Tipo de incidente"
          value={type}
          onPress={() => setShowTypeModal(true)}
        />

        <CustomInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <RiskSelector value={riskLevel} onChange={setRiskLevel} />

        <LocationCard
          latitude={latitude}
          longitude={longitude}
          city={city}
          sector={sector}
          street={street}
          addressUnavailable={addressUnavailable}
          onPress={getCurrentLocation}
        />

        <CustomButton
          title={loading ? "Guardando..." : "Enviar reporte"}
          onPress={handleSubmit}
        />

        <OptionModal
          visible={showTypeModal}
          title="Selecciona el tipo de incidente"
          options={INCIDENT_TYPES}
          onClose={() => setShowTypeModal(false)}
          onSelect={setType}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
});
