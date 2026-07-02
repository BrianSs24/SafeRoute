import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { useEffect, useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileOption from "../../components/profile/ProfileOption";
import ProfileStats from "../../components/profile/ProfileStats";
import { loadProfile } from "../../viewmodels/profile/ProfileViewModel";

export default function ProfileScreen() {
  const [profile, setProfile] =
  useState<any>(null);
  
  useEffect(() => {

  async function fetchProfile() {

    const result =
      await loadProfile();

    if (result.success) {

      setProfile(result.profile);

    }

  }

  fetchProfile();

}, []);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
     <ProfileHeader
    name={
      profile
        ? `${profile.firstName} ${profile.lastName}`
        : "Usuario"
    }
    email={
      profile?.email ??
      ""
    }
    image={
      profile?.photoURL
    }
/>

      <ProfileStats
    reports={24}
    verified={18}
    reputation={96}
/>

      <View style={styles.section}>

        <ProfileOption
          title="Editar perfil"
          subtitle="Actualiza tu información"
          icon="account-edit"
          onPress={() => router.push("/edit-profile")}
        />

        <ProfileOption
          title="Seguridad"
          subtitle="Contraseña y acceso"
          icon="shield-lock"
          onPress={() => router.push("/change-password")}
        />

      </View>

      <View style={styles.section}>

        <ProfileOption
          title="Mis reportes"
          subtitle="Consulta tu historial"
          icon="clipboard-list"
          onPress={() => router.push("/my-reports")}
        />

        <ProfileOption
          title="Configuración"
          subtitle="Preferencias de la aplicación"
          icon="cog"
          onPress={() => router.push("/settings")}
        />

        <ProfileOption
          title="Acerca de SafeRoute"
          subtitle="Versión e información"
          icon="information-outline"
          onPress={() => {}}
        />

        <ProfileOption
          title="Cerrar sesión"
          subtitle="Salir de tu cuenta"
          icon="logout"
          color="#EF4444"
          onPress={() => router.replace("/login")}
        />

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    paddingBottom: 40,
  },

  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },

});