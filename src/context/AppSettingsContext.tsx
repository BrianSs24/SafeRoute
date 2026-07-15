import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser } from "../services/AuthService";
import {
  loadCurrentUserProfile,
  UserAppearance,
} from "../services/UserService";
import { AppTheme, buildAppTheme, ThemeId } from "../styles/theme";
import {
  saveAppearanceSettings,
  saveNotificationsPreference,
} from "../viewmodels/profile/SettingsViewModel";

type AppSettingsContextValue = {
  darkMode: boolean;
  themeId: ThemeId;
  /** Paleta resuelta para toda la app (modo + acento). */
  theme: AppTheme;
  notificationsEnabled: boolean;
  ready: boolean;
  setDarkMode: (value: boolean) => Promise<void>;
  setThemeId: (value: ThemeId) => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  reloadFromProfile: () => Promise<void>;
};

const defaultAppearance: UserAppearance = {
  darkMode: false,
  themeId: "blue",
};

const AppSettingsContext =
  createContext<AppSettingsContextValue | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Preferencias de cuenta (apariencia global + opt-in de notificaciones).
 * El tema se deriva aquí y se consume en cualquier pantalla vía useAppTheme().
 */
export function AppSettingsProvider({ children }: Props) {
  const [darkMode, setDarkModeState] = useState(
    defaultAppearance.darkMode
  );
  const [themeId, setThemeIdState] = useState<ThemeId>(
    defaultAppearance.themeId
  );
  const [notificationsEnabled, setNotificationsEnabledState] =
    useState(true);
  const [ready, setReady] = useState(false);

  const theme = useMemo(
    () => buildAppTheme(darkMode, themeId),
    [darkMode, themeId]
  );

  const reloadFromProfile = useCallback(async () => {
    const user = getCurrentUser();

    if (!user) {
      setDarkModeState(defaultAppearance.darkMode);
      setThemeIdState(defaultAppearance.themeId);
      setNotificationsEnabledState(true);
      setReady(true);
      return;
    }

    try {
      const profile = await loadCurrentUserProfile(user.uid);
      const appearance = profile?.appearance ?? defaultAppearance;

      setDarkModeState(Boolean(appearance.darkMode));
      setThemeIdState(appearance.themeId ?? "blue");
      setNotificationsEnabledState(
        profile?.notificationsEnabled ?? true
      );
    } catch {
      setDarkModeState(defaultAppearance.darkMode);
      setThemeIdState(defaultAppearance.themeId);
      setNotificationsEnabledState(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    reloadFromProfile();
  }, [reloadFromProfile]);

  const persistAppearance = useCallback(
    async (next: UserAppearance) => {
      // Actualización optimista: toda la UI se re-pinta al instante.
      setDarkModeState(next.darkMode);
      setThemeIdState(next.themeId);

      const result = await saveAppearanceSettings(next);

      if (!result.success) {
        await reloadFromProfile();
        throw new Error(result.message);
      }
    },
    [reloadFromProfile]
  );

  const setDarkMode = useCallback(
    async (value: boolean) => {
      await persistAppearance({ darkMode: value, themeId });
    },
    [persistAppearance, themeId]
  );

  const setThemeId = useCallback(
    async (value: ThemeId) => {
      await persistAppearance({ darkMode, themeId: value });
    },
    [persistAppearance, darkMode]
  );

  const setNotificationsEnabled = useCallback(
    async (value: boolean) => {
      setNotificationsEnabledState(value);

      const result = await saveNotificationsPreference(value);

      if (!result.success) {
        await reloadFromProfile();
        throw new Error(result.message);
      }
    },
    [reloadFromProfile]
  );

  const value = useMemo(
    () => ({
      darkMode,
      themeId,
      theme,
      notificationsEnabled,
      ready,
      setDarkMode,
      setThemeId,
      setNotificationsEnabled,
      reloadFromProfile,
    }),
    [
      darkMode,
      themeId,
      theme,
      notificationsEnabled,
      ready,
      setDarkMode,
      setThemeId,
      setNotificationsEnabled,
      reloadFromProfile,
    ]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);

  if (!ctx) {
    throw new Error(
      "useAppSettings debe usarse dentro de AppSettingsProvider."
    );
  }

  return ctx;
}

/** Acceso directo a la paleta global activa. */
export function useAppTheme(): AppTheme {
  return useAppSettings().theme;
}
