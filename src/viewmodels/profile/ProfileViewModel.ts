import { getCurrentUser } from "../../services/AuthService";
import { getIncidentsByUser } from "../../services/IncidentService";
import { loadCurrentUserProfile } from "../../services/UserService";

/**
 * Carga perfil + métricas derivadas de los reportes del usuario.
 * Las estadísticas se calculan en cliente a partir de la colección `incidents`.
 */
export async function loadProfile() {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
      };
    }

    const profile = await loadCurrentUserProfile(user.uid);
    const reports = await getIncidentsByUser(user.uid);

    const total = reports.length;
    const verified = reports.filter(
      (item: any) =>
        item.status === "Revisado" || item.status === "Resuelto"
    ).length;

    // Índice simple de confianza basado en reportes revisados/resueltos.
    const reputation =
      total === 0
        ? 100
        : Math.round((verified / total) * 100);

    return {
      success: true as const,
      profile: profile ?? {
        uid: user.uid,
        firstName: "",
        lastName: "",
        email: user.email ?? "",
        phone: "",
        photoURL: user.photoURL ?? "",
      },
      stats: {
        reports: total,
        verified,
        reputation,
      },
      authEmail: user.email ?? "",
    };
  } catch {
    return {
      success: false as const,
    };
  }
}
