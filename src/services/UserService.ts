import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

/** Preferencias visuales del usuario (módulo Perfil / Configuración). */
export type UserAppearance = {
  darkMode: boolean;
  themeId: "blue" | "teal" | "indigo";
};

export type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoURL?: string;
  appearance?: UserAppearance;
  /**
   * Preferencia para futuras alertas push / inteligentes.
   * true por defecto cuando el campo aún no existe en Firestore.
   */
  notificationsEnabled?: boolean;
};

/** Default para documentos legacy que aún no tienen el campo. */
export const DEFAULT_NOTIFICATIONS_ENABLED = true;

/** Únicas claves persistibles en `users/{uid}` desde el cliente. */
const USER_DOCUMENT_KEYS = [
  "uid",
  "firstName",
  "lastName",
  "email",
  "phone",
  "photoURL",
  "appearance",
  "notificationsEnabled",
] as const;

/**
 * ÚNICA función de sanitización para escrituras a `users/{uid}`.
 *
 * La sanitización shallow previa solo omitía `undefined` de primer nivel;
 * Firestore también rechaza `undefined` anidados (p. ej. appearance.themeId).
 * Además, re-esparcir documentos crudos podía reintroducir estructuras incompletas.
 *
 * Esta función:
 * - elimina undefined en cualquier profundidad
 * - conserva null
 * - fuerza notificationsEnabled a boolean (default true)
 * - limita el payload a claves conocidas del perfil
 */
export function sanitizeUserDocumentForFirestore(
  data: Record<string, unknown>
): Record<string, unknown> {
  const deepCleaned = removeUndefinedDeep(data);

  if (
    deepCleaned === null ||
    typeof deepCleaned !== "object" ||
    Array.isArray(deepCleaned)
  ) {
    return {
      notificationsEnabled: DEFAULT_NOTIFICATIONS_ENABLED,
    };
  }

  const source = deepCleaned as Record<string, unknown>;
  const payload: Record<string, unknown> = {};

  for (const key of USER_DOCUMENT_KEYS) {
    if (source[key] !== undefined) {
      payload[key] = source[key];
    }
  }

  payload.notificationsEnabled =
    typeof payload.notificationsEnabled === "boolean"
      ? payload.notificationsEnabled
      : DEFAULT_NOTIFICATIONS_ENABLED;

  if (payload.appearance !== undefined) {
    payload.appearance = normalizeAppearance(payload.appearance);
  }

  // Segunda pasada: garantizar que normalizeAppearance no dejó huecos inválidos.
  return removeUndefinedDeep(payload) as Record<string, unknown>;
}

/**
 * Elimina `undefined` de forma recursiva.
 * `null`, Date, Timestamp-like y primitivos se conservan.
 */
function removeUndefinedDeep(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  // No recorrer instancias especiales (Timestamp, Date, etc.).
  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => removeUndefinedDeep(item))
      .filter((item) => item !== undefined);
  }

  // Objetos con prototype distinto a Object (p. ej. Timestamp de Firestore).
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, nested] of Object.entries(
    value as Record<string, unknown>
  )) {
    if (nested === undefined) {
      continue;
    }

    const cleaned = removeUndefinedDeep(nested);

    if (cleaned !== undefined) {
      result[key] = cleaned;
    }
  }

  return result;
}

function normalizeAppearance(value: unknown): UserAppearance {
  const raw =
    value !== null && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const themeId = raw.themeId;

  return {
    darkMode: Boolean(raw.darkMode),
    themeId:
      themeId === "teal" || themeId === "indigo" || themeId === "blue"
        ? themeId
        : "blue",
  };
}

/**
 * Convierte un documento Firestore (posiblemente incompleto / legacy)
 * en un UserProfile tipado sin reintroducir propiedades undefined.
 */
function normalizeLoadedProfile(
  data: Record<string, unknown>,
  uid: string
): UserProfile {
  const profile: UserProfile = {
    uid: typeof data.uid === "string" ? data.uid : uid,
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    email: typeof data.email === "string" ? data.email : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    notificationsEnabled:
      typeof data.notificationsEnabled === "boolean"
        ? data.notificationsEnabled
        : DEFAULT_NOTIFICATIONS_ENABLED,
  };

  if (typeof data.photoURL === "string") {
    profile.photoURL = data.photoURL;
  } else if (data.photoURL === null) {
    profile.photoURL = "";
  }

  if (data.appearance !== undefined && data.appearance !== null) {
    profile.appearance = normalizeAppearance(data.appearance);
  }

  return profile;
}

export async function saveUserProfile(profile: UserProfile) {
  const userRef = doc(db, "users", profile.uid);

  await setDoc(
    userRef,
    sanitizeUserDocumentForFirestore({ ...profile } as Record<string, unknown>),
    { merge: true }
  );
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeLoadedProfile(
    snapshot.data() as Record<string, unknown>,
    uid
  );
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const userRef = doc(db, "users", uid);

  await updateDoc(
    userRef,
    sanitizeUserDocumentForFirestore({ ...data } as Record<string, unknown>)
  );
}

export async function loadCurrentUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeLoadedProfile(
    snapshot.data() as Record<string, unknown>,
    uid
  );
}
