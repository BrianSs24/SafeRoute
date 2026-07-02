import { getIncidentsByUser } from "../../services/IncidentService";

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