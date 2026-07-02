import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import LocationCard from "../../components/LocationCard";
import OptionModal from "../../components/OptionModal";
import RiskSelector from "../../components/RiskSelector";
import SelectCard from "../../components/SelectCard";
import { INCIDENT_TYPES } from "../../constants/incidentTypes";
import { getCurrentUser } from "../../services/AuthService";
import { theme } from "../../styles/theme";
import { saveIncident } from "../../viewmodels/report/ReportIncidentViewModel";

export default function ReportIncidentScreen() {

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
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

  const location =
    await Location.getCurrentPositionAsync({});

  setLatitude(location.coords.latitude);

  setLongitude(location.coords.longitude);

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
console.log("Resultado:", result);

  setLoading(false);

  if (result.success) {

    Alert.alert(
      "Éxito",
      "Reporte enviado correctamente."
    );

    setType("");
    setDescription("");
    setRiskLevel("");
    setLatitude(null);
    setLongitude(null);

    Alert.alert(
  "Éxito",
  "Reporte guardado correctamente."
);

console.log(result);

  } else {

    Alert.alert(
      "Error",
      "No fue posible guardar el reporte."
    );

  }

};
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Reportar incidente
      </Text>

      <Text style={styles.subtitle}>
        Completa la información del incidente.
      </Text>

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

      <RiskSelector
    value={riskLevel}
    onChange={setRiskLevel}
/>
<LocationCard
  latitude={latitude}
  longitude={longitude}
  onPress={getCurrentLocation}
/>
      <CustomButton
        title={loading ? "Guardando..." : "Enviar reporte"}
      onPress={handleSubmit}     
      />

      <View style={{ marginTop: 15 }}>
        <CustomButton
          title="Volver"
          onPress={() => router.back()}
        />
      </View>

        <OptionModal
  visible={showTypeModal}
  title="Selecciona el tipo de incidente"
  options={INCIDENT_TYPES}
  onClose={() => setShowTypeModal(false)}
  onSelect={setType}
/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: 24,
    paddingTop: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 8,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: 25,
  },

});