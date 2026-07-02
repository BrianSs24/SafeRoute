import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
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

export default auth;
export function getCurrentUser() {
  return auth.currentUser;
}