import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";

import app from "../config/firebase";

const auth = getAuth(app);

/**
 * Iniciar sesión
 */
export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Envía un correo de recuperación de contraseña vía Firebase Auth.
 *
 * Por qué existe: el login no debe pedir la contraseña actual si el usuario
 * ya no la recuerda; Firebase entrega el enlace por email.
 * Riesgo mitigado: no altera login/register; falla seguro si el email es inválido.
 * Compatibilidad: Firebase Auth + Expo SDK 56 (SDK JS existente).
 */
export async function sendPasswordReset(email: string) {
  return await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Registrar usuario
 */
export async function register(email: string, password: string) {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

/**
 * Cerrar sesión
 */
export async function logout() {
  return await signOut(auth);
}

/**
 * Cambia la contraseña del usuario autenticado.
 * Requiere reautenticación con la contraseña actual (política de Firebase Auth).
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No hay un usuario autenticado.");
  }

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export default auth;
export function getCurrentUser() {
  return auth.currentUser;
}