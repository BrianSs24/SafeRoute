import { getCurrentUser } from "../../services/AuthService";
import {
  DEFAULT_NOTIFICATIONS_ENABLED,
  loadCurrentUserProfile,
  saveUserProfile,
  UserProfile,
} from "../../services/UserService";

/** Carga el perfil desde Firestore (o datos base de Auth si aún no existe documento). */
export async function loadEditProfile() {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
        message: "No hay un usuario autenticado.",
      };
    }

    const profile = await loadCurrentUserProfile(user.uid);

    return {
      success: true as const,
      profile: {
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        email: profile?.email ?? user.email ?? "",
        phone: profile?.phone ?? "",
        photoURL:
          profile?.photoURL ??
          (typeof user.photoURL === "string" ? user.photoURL : ""),
        appearance: profile?.appearance,
        notificationsEnabled:
          profile?.notificationsEnabled ?? DEFAULT_NOTIFICATIONS_ENABLED,
      },
    };
  } catch {
    return {
      success: false as const,
      message: "No fue posible cargar el perfil.",
    };
  }
}

export async function saveProfile(
  firstName: string,
  lastName: string,
  email: string,
  phone: string
) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "No hay un usuario autenticado.",
      };
    }

    if (!firstName.trim() || !lastName.trim()) {
      return {
        success: false,
        message: "Nombre y apellido son obligatorios.",
      };
    }

    if (!email.trim() || !email.includes("@")) {
      return {
        success: false,
        message: "Ingresa un correo electrónico válido.",
      };
    }

    const existing = await loadCurrentUserProfile(user.uid);

    const profile: UserProfile = {
      uid: user.uid,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photoURL:
        existing?.photoURL ??
        (typeof user.photoURL === "string" ? user.photoURL : ""),
      notificationsEnabled:
        existing?.notificationsEnabled ?? DEFAULT_NOTIFICATIONS_ENABLED,
    };

    if (existing?.appearance) {
      profile.appearance = {
        darkMode: Boolean(existing.appearance.darkMode),
        themeId: existing.appearance.themeId ?? "blue",
      };
    }

    await saveUserProfile(profile);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message ??
        "No fue posible guardar el perfil.",
    };
  }
}
