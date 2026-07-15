import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { AppNotification } from "../models/Notification";

/**
 * Lectura de notificaciones in-app del usuario.
 * La colección `notifications` puede estar vacía hasta que un backend/FCM la alimente.
 */
export async function getNotificationsByUser(
  userId: string
): Promise<AppNotification[]> {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<AppNotification, "id">),
    }));
  } catch (error) {
    /**
     * Fallback sin orderBy: evita fallar en cliente si aún no existe
     * el índice compuesto userId + createdAt en Firebase Console.
     */
    console.warn(
      "[NotificationService] orderBy no disponible, usando query simple.",
      error
    );

    const fallback = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(fallback);

    const items = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<AppNotification, "id">),
    }));

    return items.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
  }
}

export async function countUnreadNotifications(
  userId: string
): Promise<number> {
  const items = await getNotificationsByUser(userId);
  return items.filter((item) => !item.read).length;
}

/** Marca una notificación como leída (UI del centro). */
export async function markNotificationAsRead(notificationId: string) {
  const ref = doc(db, "notifications", notificationId);
  await updateDoc(ref, { read: true });
}
