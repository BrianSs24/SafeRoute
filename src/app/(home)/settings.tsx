import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import {
  useAppSettings,
  useAppTheme,
} from "../../context/AppSettingsContext";
import {
  buildAppTheme,
  THEME_OPTIONS,
  ThemeId,
} from "../../styles/theme";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const {
    darkMode,
    themeId,
    notificationsEnabled,
    setDarkMode,
    setThemeId,
    setNotificationsEnabled,
    reloadFromProfile,
  } = useAppSettings();

  useEffect(() => {
    reloadFromProfile();
  }, [reloadFromProfile]);

  const [saving, setSaving] = useState(false);
  const [savingNotifications, setSavingNotifications] =
    useState(false);

  async function handleDarkMode(value: boolean) {
    try {
      setSaving(true);
      await setDarkMode(value);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ??
          "No fue posible actualizar el modo oscuro."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTheme(next: ThemeId) {
    if (next === themeId) return;

    try {
      setSaving(true);
      await setThemeId(next);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ?? "No fue posible actualizar el tema."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleNotifications(value: boolean) {
    try {
      setSavingNotifications(true);
      await setNotificationsEnabled(value);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ??
          "No fue posible actualizar las notificaciones."
      );
    } finally {
      setSavingNotifications(false);
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PageHeader
        title="Configuración"
        subtitle="Personaliza la apariencia de tu cuenta"
        backgroundColor={theme.colors.surface}
        titleColor={theme.colors.text}
        subtitleColor={theme.colors.textSecondary}
        iconColor={theme.colors.text}
        backBackgroundColor={theme.colors.mutedSurface}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Apariencia
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text
                style={[styles.rowTitle, { color: theme.colors.text }]}
              >
                Modo oscuro
              </Text>
              <Text
                style={[
                  styles.rowSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Reduce el brillo en toda la aplicación.
              </Text>
            </View>

            {saving ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Switch
                value={darkMode}
                onValueChange={handleDarkMode}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            )}
          </View>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text, marginTop: 28 },
          ]}
        >
          Notificaciones
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              marginBottom: 8,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text
                style={[styles.rowTitle, { color: theme.colors.text }]}
              >
                Alertas inteligentes
              </Text>
              <Text
                style={[
                  styles.rowSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Preferencia para futuras notificaciones push (aún no se
                envían alertas).
              </Text>
            </View>

            {savingNotifications ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotifications}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            )}
          </View>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text, marginTop: 28 },
          ]}
        >
          Tema de acento
        </Text>

        <Text
          style={[
            styles.helper,
            { color: theme.colors.textSecondary },
          ]}
        >
          Elige la familia de color utilizada en toda la app.
        </Text>

        {THEME_OPTIONS.map((option) => {
          const selected = option.id === themeId;
          const preview = buildAppTheme(darkMode, option.id);

          return (
            <Pressable
              key={option.id}
              onPress={() => handleTheme(option.id)}
              disabled={saving}
              style={({ pressed }) => [
                styles.themeCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: selected
                    ? preview.colors.primary
                    : theme.colors.border,
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: preview.colors.primary },
                ]}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {option.description}
                </Text>
              </View>

              <MaterialCommunityIcons
                name={
                  selected
                    ? "check-circle"
                    : "checkbox-blank-circle-outline"
                }
                size={24}
                color={
                  selected
                    ? preview.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  helper: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  themeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },

  swatch: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
});
