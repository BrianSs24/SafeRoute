import { Incident } from "../../models/Incident";
import { createIncident } from "../../services/IncidentService";

export async function saveIncident(data: Incident) {

  try {

    await createIncident(data);

    return {
      success: true,
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
    };

  }

}