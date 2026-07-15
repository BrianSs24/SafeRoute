export type ThemeId = "blue" | "teal" | "indigo";

export type AppThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  soft: string;
  accentBorder: string;
  mutedSurface: string;
  overlay: string;
  inputBackground: string;
};

export type AppTheme = {
  darkMode: boolean;
  themeId: ThemeId;
  colors: AppThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

const accents: Record<
  ThemeId,
  { primary: string; primaryDark: string; soft: string; border: string }
> = {
  blue: {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    soft: "#EFF6FF",
    border: "#BFDBFE",
  },
  teal: {
    primary: "#0D9488",
    primaryDark: "#0F766E",
    soft: "#F0FDFA",
    border: "#99F6E4",
  },
  indigo: {
    primary: "#4F46E5",
    primaryDark: "#4338CA",
    soft: "#EEF2FF",
    border: "#C7D2FE",
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
} as const;

/**
 * Única fábrica de apariencia de SafeRoute.
 * darkMode + themeId → paleta completa para toda la app.
 */
export function buildAppTheme(
  darkMode: boolean,
  themeId: ThemeId = "blue"
): AppTheme {
  const accent = accents[themeId] ?? accents.blue;

  if (darkMode) {
    return {
      darkMode: true,
      themeId,
      spacing,
      radius,
      colors: {
        primary: accent.primary,
        primaryDark: accent.primaryDark,
        secondary: "#E2E8F0",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
        textSecondary: "#94A3B8",
        border: "#334155",
        soft: "#1E3A5F",
        accentBorder: accent.border,
        mutedSurface: "#334155",
        overlay: "rgba(15, 23, 42, 0.72)",
        inputBackground: "#1E293B",
      },
    };
  }

  return {
    darkMode: false,
    themeId,
    spacing,
    radius,
    colors: {
      primary: accent.primary,
      primaryDark: accent.primaryDark,
      secondary: "#0F172A",
      success: "#22C55E",
      warning: "#F59E0B",
      danger: "#EF4444",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#1E293B",
      textSecondary: "#64748B",
      border: "#CBD5E1",
      soft: accent.soft,
      accentBorder: accent.border,
      mutedSurface: "#F3F4F6",
      overlay: "rgba(15, 23, 42, 0.45)",
      inputBackground: "#FFFFFF",
    },
  };
}

/** Tema claro por defecto (fallback estático / SSR). Preferir useAppTheme(). */
export const theme = buildAppTheme(false, "blue");

export const THEME_OPTIONS: {
  id: ThemeId;
  label: string;
  description: string;
}[] = [
  {
    id: "blue",
    label: "Azul SafeRoute",
    description: "Identidad principal de la aplicación",
  },
  {
    id: "teal",
    label: "Teal",
    description: "Acento fresco para entornos claros",
  },
  {
    id: "indigo",
    label: "Índigo",
    description: "Variante elegante con mayor contraste",
  },
];
