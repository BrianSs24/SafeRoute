import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import { saveProfile } from "../../viewmodels/profile/EditProfileViewModel";

export default function EditProfileScreen() {

  const [firstName, setFirstName] = useState("Brian");
  const [lastName, setLastName] = useState("Sosa");
  const [email, setEmail] = useState("brian@gmail.com");
  const [phone, setPhone] = useState("");

 async function handleSaveProfile() {

  const result = await saveProfile(

    firstName,

    lastName,

    email,

    phone

  );

  if (result.success) {

    Alert.alert(
      "Perfil",
      "Perfil actualizado correctamente."
    );

  } else {

    Alert.alert(
      "Error",
      result.message
    );

  }

}

  return (

    <View style={styles.container}>

      <PageHeader
        title="Editar perfil"
        subtitle="Actualiza tu información personal"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.avatarContainer}>

          <View style={styles.avatar}>

            <MaterialCommunityIcons
              name="account"
              size={70}
              color="#FFFFFF"
            />

          </View>

          <TouchableOpacity style={styles.cameraButton}>

            <MaterialCommunityIcons
              name="camera"
              size={22}
              color="#FFFFFF"
            />

          </TouchableOpacity>

          <Text style={styles.changePhoto}>
            Cambiar fotografía
          </Text>

        </View>

        <Text style={styles.label}>
          Nombre
        </Text>

        <CustomInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Nombre"
        />

        <Text style={styles.label}>
          Apellido
        </Text>

        <CustomInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Apellido"
        />

        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <CustomInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>
          Teléfono
        </Text>

        <CustomInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="809-000-0000"
        />

        <View style={{ marginTop: 30 }}>

          <CustomButton
    title="Guardar cambios"
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

    backgroundColor: "#F3F4F6",

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

    backgroundColor: "#2563EB",

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

    backgroundColor: "#1D4ED8",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 2,

    borderColor: "#FFFFFF",

  },

  changePhoto: {

    marginTop: 15,

    color: "#2563EB",

    fontWeight: "700",

    fontSize: 15,

  },

  label: {

    fontSize: 15,

    fontWeight: "700",

    color: "#374151",

    marginBottom: 8,

    marginLeft: 4,

  },

});