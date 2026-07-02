import { getCurrentUser } from "../../services/AuthService";
import { loadCurrentUserProfile } from "../../services/UserService";

export async function loadProfile() {

  try {

    const user = getCurrentUser();

    if (!user) {

      return {
        success: false,
      };

    }

    const profile =
      await loadCurrentUserProfile(user.uid);

    return {
      success: true,
      profile,
    };

  } catch {

    return {
      success: false,
    };

  }

}