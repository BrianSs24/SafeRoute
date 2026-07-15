import { register } from "../../services/AuthService";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

export async function registerUser(
  email: string,
  password: string
) {
  try {

    const userCredential = await register(
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user,
    };

  } catch (error: any) {

    return {
        success: false,
        message: getFirebaseErrorMessage(error.message),
    };

}
}