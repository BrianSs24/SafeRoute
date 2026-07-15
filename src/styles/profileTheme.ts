/**
 * Compatibilidad: el sistema de apariencia vive en `styles/theme.ts`.
 * Este archivo reexporta para no romper imports existentes de Perfil.
 */
export {
  buildAppTheme as getProfilePalette,
  THEME_OPTIONS,
  type ThemeId as ProfileThemeId,
  type AppTheme,
} from "./theme";
