export interface Incident {

  id?: string;

  type: string;

  description: string;

  riskLevel: "Bajo" | "Medio" | "Alto";

  latitude: number;

  longitude: number;

  userId: string;

  status?: "Pendiente" | "Revisado" | "Resuelto";

  createdAt?: Date;

}