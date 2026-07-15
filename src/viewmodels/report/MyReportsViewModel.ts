import {
  deleteIncident,
  getIncidentsByUser,
  updateIncident,
} from "../../services/IncidentService";

/** Carga los reportes del usuario autenticado desde Firestore. */
export async function loadMyReports(userId: string) {
  try {
    const reports = await getIncidentsByUser(userId);

    return {
      success: true,
      reports,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      reports: [],
    };
  }
}

/**
 * Persiste cambios de tipo, descripción y riesgo sobre un incidente existente.
 * No incluye coordenadas: la ubicación del reporte permanece intacta.
 */
export async function updateMyReport(
  incidentId: string,
  data: {
    type: string;
    description: string;
    riskLevel: "Bajo" | "Medio" | "Alto";
  }
) {
  try {
    await updateIncident(incidentId, data);

    return { success: true };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message:
        "No fue posible actualizar el reporte. Inténtalo de nuevo.",
    };
  }
}

/** Elimina un reporte del usuario y reporta el resultado a la UI. */
export async function deleteMyReport(incidentId: string) {
  try {
    await deleteIncident(incidentId);

    return { success: true };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message:
        "No fue posible eliminar el reporte. Inténtalo de nuevo.",
    };
  }
}
