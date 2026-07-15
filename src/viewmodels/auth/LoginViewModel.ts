import { login } from "../../services/AuthService";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

export async function loginUser(
  email: string,
  password: string
) {
  try {
    const userCredential = await login(email, password);

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