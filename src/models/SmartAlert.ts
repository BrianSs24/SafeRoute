/**
 * Contratos para la futura fase de alertas inteligentes (FCM + radio geográfico).
 * No hay implementación de envío ni registro de tokens en esta fase.
 */

/** Registro de dispositivo que se persistirá cuando se active FCM. */
export interface DeviceRegistration {
  userId: string;
  /** Token FCM (placeholder hasta integrar messaging). */
  fcmToken?: string;
  platform: "ios" | "android" | "web";
  updatedAt?: any;
}

/** Última ubicación conocida del usuario (para radio ≤ 5 km). */
export interface LastKnownLocation {
  latitude: number;
  longitude: number;
  updatedAt?: any;
}

/**
 * Regla planificada:
 * incidente.riskLevel === "Alto" && distance(incident, lastKnownLocation) <= radiusKm
 * → push al dispositivo si notificationsEnabled === true.
 */
export interface SmartAlertRule {
  radiusKm: number;
  riskLevels: Array<"Alto">;
  requireNotificationsEnabled: true;
}

export const DEFAULT_SMART_ALERT_RULE: SmartAlertRule = {
  radiusKm: 5,
  riskLevels: ["Alto"],
  requireNotificationsEnabled: true,
};

/** Payload futuro hacia el backend / Cloud Function. */
export interface SmartAlertEvaluationInput {
  incidentId: string;
  incidentLatitude: number;
  incidentLongitude: number;
  riskLevel: string;
  candidateUserId: string;
  lastKnownLocation?: LastKnownLocation;
  notificationsEnabled: boolean;
  device?: DeviceRegistration;
}
