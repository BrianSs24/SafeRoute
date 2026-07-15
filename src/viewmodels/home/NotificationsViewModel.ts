import { getCurrentUser } from "../../services/AuthService";
import {
  getNotificationsByUser,
  markNotificationAsRead,
} from "../../services/NotificationService";
import { AppNotification } from "../../models/Notification";

export async function loadNotifications() {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false as const,
        notifications: [] as AppNotification[],
        message: "No hay un usuario autenticado.",
      };
    }

    const notifications = await getNotificationsByUser(user.uid);

    return {
      success: true as const,
      notifications,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false as const,
      notifications: [] as AppNotification[],
      message: "No fue posible cargar las notificaciones.",
    };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await markNotificationAsRead(notificationId);
    return { success: true as const };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      message: "No fue posible actualizar la notificación.",
    };
  }
}
