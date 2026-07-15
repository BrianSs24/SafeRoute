import { getCurrentUser } from "../../services/AuthService";
import { countUnreadNotifications } from "../../services/NotificationService";
import { loadCurrentUserProfile } from "../../services/UserService";

/**
 * Datos del Home: nombre real desde Firestore + avatar + badge de no leídas.
 * Se vuelve a consultar al ganar foco para reflejar cambios desde Editar Perfil.
 */
export async function loadHomeHeader() {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
        message: "No hay un usuario autenticado.",
      };
    }

    const profile = await loadCurrentUserProfile(user.uid);
    const unreadCount = await countUnreadNotifications(user.uid);

    const firstName =
      profile?.firstName?.trim() ||
      user.displayName?.split(" ")[0] ||
      "Usuario";

    return {
      success: true as const,
      firstName,
      photoURL: profile?.photoURL || user.photoURL || "",
      unreadCount,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false as const,
      message: "No fue posible cargar tu perfil.",
    };
  }
}
