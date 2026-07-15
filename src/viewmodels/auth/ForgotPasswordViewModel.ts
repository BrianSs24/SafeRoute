import { sendPasswordReset } from "../../services/AuthService";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

/**
 * Orquesta el envío del enlace de recuperación.
 *
 * Por qué ViewModel: la pantalla solo gestiona UI (loading/mensajes);
 * la regla de email vacío y el mapeo de errores de Firebase viven aquí,
 * igual que LoginViewModel, sin acoplar Firebase a la vista.
 */
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  const trimmed = email.trim();

  if (!trimmed) {
    return {
      success: false,
      message: "Ingresa tu correo electrónico.",
    };
  }

  try {
    await sendPasswordReset(trimmed);

    return {
      success: true,
      message:
        "Se ha enviado un enlace de recuperación a tu correo electrónico.",
    };
  } catch (error: unknown) {
    const raw =
      error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";

    return {
      success: false,
      message: getFirebaseErrorMessage(raw),
    };
  }
}
