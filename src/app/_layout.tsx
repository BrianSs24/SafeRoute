import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  AppSettingsProvider,
  useAppSettings,
} from "../context/AppSettingsContext";

function RootNavigation() {
  const { darkMode, theme } = useAppSettings();

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <RootNavigation />
    </AppSettingsProvider>
  );
}
