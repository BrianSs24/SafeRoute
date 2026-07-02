import { getAllIncidents } from "../../services/IncidentService";

export async function loadRoutes() {

  try {

    const incidents = await getAllIncidents();

    return {
      success: true,
      incidents,
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      incidents: [],
    };

  }

}