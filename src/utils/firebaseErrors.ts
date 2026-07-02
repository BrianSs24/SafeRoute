export function getFirebaseErrorMessage(error: string): string {

  switch (error) {

    case "Firebase: Error (auth/invalid-credential).":
      return "El correo o la contraseña son incorrectos.";

    case "Firebase: Error (auth/user-not-found).":
      return "No existe una cuenta con ese correo.";

    case "Firebase: Error (auth/email-already-in-use).":
      return "Este correo ya está registrado.";

    case "Firebase: Error (auth/weak-password).":
      return "La contraseña debe tener al menos 6 caracteres.";

    case "Firebase: Error (auth/invalid-email).":
      return "El correo electrónico no es válido.";

    default:
      return "Ha ocurrido un error inesperado.";
  }

}