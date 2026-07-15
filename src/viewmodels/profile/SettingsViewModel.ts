import { getCurrentUser } from "../../services/AuthService";
import {
  DEFAULT_NOTIFICATIONS_ENABLED,
  saveUserProfile,
  UserAppearance,
  UserProfile,
  loadCurrentUserProfile,
} from "../../services/UserService";

/**
 * Arma un payload de escritura sin claves opcionales en undefined.
 * La sanitización profunda final vive solo en UserService.
 */
function buildProfilePayload(
  existing: UserProfile | null,
  user: { uid: string; email: string | null; photoURL: string | null }
): UserProfile {
  const payload: UserProfile = {
    uid: user.uid,
    firstName: existing?.firstName ?? "",
    lastName: existing?.lastName ?? "",
    email: existing?.email ?? user.email ?? "",
    phone: existing?.phone ?? "",
    photoURL:
      existing?.photoURL ??
      (typeof user.photoURL === "string" ? user.photoURL : ""),
    notificationsEnabled:
      existing?.notificationsEnabled ?? DEFAULT_NOTIFICATIONS_ENABLED,
  };

  if (existing?.appearance) {
    payload.appearance = {
      darkMode: Boolean(existing.appearance.darkMode),
      themeId: existing.appearance.themeId ?? "blue",
    };
  }

  return payload;
}

/** Persiste preferencias de apariencia en el documento Firestore del usuario. */
export async function saveAppearanceSettings(
  appearance: UserAppearance
) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
        message: "No hay un usuario autenticado.",
      };
    }

    const existing = await loadCurrentUserProfile(user.uid);
    const profile: UserProfile = {
      ...buildProfilePayload(existing, user),
      appearance: {
        darkMode: Boolean(appearance.darkMode),
        themeId: appearance.themeId ?? "blue",
      },
    };

    await saveUserProfile(profile);

    return { success: true as const };
  } catch (error: any) {
    return {
      success: false as const,
      message:
        error?.message ??
        "No fue posible guardar la configuración.",
    };
  }
}

/** Guarda el opt-in/opt-out de notificaciones (sin enviar push todavía). */
export async function saveNotificationsPreference(
  notificationsEnabled: boolean
) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
        message: "No hay un usuario autenticado.",
      };
    }

    const existing = await loadCurrentUserProfile(user.uid);
    const profile: UserProfile = {
      ...buildProfilePayload(existing, user),
      notificationsEnabled: Boolean(notificationsEnabled),
    };

    await saveUserProfile(profile);

    return { success: true as const };
  } catch (error: any) {
    return {
      success: false as const,
      message:
        error?.message ??
        "No fue posible guardar la preferencia de notificaciones.",
    };
  }
}
