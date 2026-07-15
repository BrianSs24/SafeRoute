import { changePassword } from "../../services/AuthService";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

/**
 * Valida y aplica el cambio de contraseña sobre Firebase Auth.
 * La reautenticación ocurre dentro de AuthService.changePassword.
 */
export async function changeUserPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  if (!currentPassword.trim()) {
    return {
      success: false as const,
      message: "Ingresa tu contraseña actual.",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false as const,
      message: "La nueva contraseña debe tener al menos 6 caracteres.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false as const,
      message: "Las contraseñas nuevas no coinciden.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false as const,
      message: "La nueva contraseña debe ser diferente a la actual.",
    };
  }

  try {
    await changePassword(currentPassword, newPassword);

    return { success: true as const };
  } catch (error: any) {
    return {
      success: false as const,
      message: getFirebaseErrorMessage(
        error?.message ?? String(error)
      ),
    };
  }
}
