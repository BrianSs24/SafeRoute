/**
 * Modelo de notificación in-app (Centro de Notificaciones).
 * Preparado para documentos en la colección Firestore `notifications`.
 * No implica envío push; FCM se integrará en una fase posterior.
 */
export type NotificationPriority = "baja" | "media" | "alta";

export type NotificationType =
  | "incidente"
  | "sistema"
  | "seguridad"
  | "cuenta";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  /** Timestamp Firestore o Date serializable. */
  createdAt?: any;
}
