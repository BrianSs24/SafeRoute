export function getFirebaseErrorMessage(error: string): string {
  const normalized = error.toLowerCase();

  if (
    normalized.includes("auth/invalid-credential") ||
    normalized.includes("auth/wrong-password") ||
    normalized.includes("auth/invalid-login-credentials")
  ) {
    return "El correo o la contraseña son incorrectos.";
  }

  if (normalized.includes("auth/user-not-found")) {
    return "No existe una cuenta con ese correo.";
  }

  if (normalized.includes("auth/email-already-in-use")) {
    return "Este correo ya está registrado.";
  }

  if (normalized.includes("auth/weak-password")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (normalized.includes("auth/invalid-email")) {
    return "El correo electrónico no es válido.";
  }

  if (normalized.includes("auth/requires-recent-login")) {
    return "Por seguridad, vuelve a iniciar sesión e intenta de nuevo.";
  }

  if (normalized.includes("auth/too-many-requests")) {
    return "Demasiados intentos. Espera un momento e inténtalo otra vez.";
  }

  return "Ha ocurrido un error inesperado.";
}