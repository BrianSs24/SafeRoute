import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import { useAppTheme } from "../../context/AppSettingsContext";
import {
  loadEditProfile,
  saveProfile,
} from "../../viewmodels/profile/EditProfileViewModel";

export default function EditProfileScreen() {
  const theme = useAppTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const result = await loadEditProfile();

      if (result.success && result.profile) {
        setFirstName(result.profile.firstName);
        setLastName(result.profile.lastName);
        setEmail(result.profile.email);
        setPhone(result.profile.phone);
      } else if (!result.success) {
        Alert.alert("Error", result.message);
      }

      setLoading(false);
    }

    hydrate();
  }, []);

  function handleChangePhotoPress() {
    Alert.alert(
      "Fotografía de perfil",
      "Esta funcionalidad estará disponible en una futura versión."
    );
  }

  async function handleSaveProfile() {
    if (saving) return;

    setSaving(true);

    const result = await saveProfile(
      firstName,
      lastName,
      email,
      phone
    );

    setSaving(false);

    if (result.success) {
      Alert.alert("Perfil", "Perfil actualizado correctamente.");
    } else {
      Alert.alert(
        "Error",
        result.message ?? "No fue posible guardar el perfil."
      );
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PageHeader
        title="Editar perfil"
        subtitle="Actualiza tu información personal"
        backgroundColor={theme.colors.surface}
        titleColor={theme.colors.text}
        subtitleColor={theme.colors.textSecondary}
        iconColor={theme.colors.text}
        backBackgroundColor={theme.colors.mutedSurface}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <MaterialCommunityIcons
              name="account"
              size={70}
              color="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.cameraButton,
              { backgroundColor: theme.colors.primaryDark },
            ]}
            onPress={handleChangePhotoPress}
            accessibilityRole="button"
            accessibilityLabel="Cambiar fotografía"
          >
            <MaterialCommunityIcons
              name="camera"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangePhotoPress}>
            <Text
              style={[
                styles.changePhoto,
                { color: theme.colors.primary },
              ]}
            >
              Cambiar fotografía
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Nombre
        </Text>
        <CustomInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Nombre"
          editable={!saving}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Apellido
        </Text>
        <CustomInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Apellido"
          editable={!saving}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Correo electrónico
        </Text>
        <CustomInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Teléfono
        </Text>
        <CustomInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="809-000-0000"
          editable={!saving}
        />

        <View style={{ marginTop: 30 }}>
          <CustomButton
            title={saving ? "Guardando..." : "Guardar cambios"}
            loading={saving}
            onPress={handleSaveProfile}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 35,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
  },

  cameraButton: {
    position: "absolute",
    bottom: 28,
    right: 110,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  changePhoto: {
    marginTop: 15,
    fontWeight: "700",
    fontSize: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
});
