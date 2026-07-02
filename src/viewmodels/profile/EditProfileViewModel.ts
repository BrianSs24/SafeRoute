import { getCurrentUser } from "../../services/AuthService";
import {
    saveUserProfile,
    UserProfile,
} from "../../services/UserService";

export async function saveProfile(
  firstName: string,
  lastName: string,
  email: string,
  phone: string
) {
  try {

    const user = getCurrentUser();

    if (!user) {

      return {
        success: false,
        message: "No hay un usuario autenticado.",
      };

    }

    const profile: UserProfile = {

      uid: user.uid,

      firstName,

      lastName,

      email,

      phone,

      photoURL: user.photoURL ?? "",

    };

    await saveUserProfile(profile);

    return {
      success: true,
    };

  } catch (error: any) {

    return {
      success: false,
      message:
        error.message ??
        "No fue posible guardar el perfil.",
    };

  }
}