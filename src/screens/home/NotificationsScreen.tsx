import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import NotificationCard from "../../components/NotificationCard";
import PageHeader from "../../components/common/PageHeader";
import { useAppTheme } from "../../context/AppSettingsContext";
import { AppNotification } from "../../models/Notification";
import { DEFAULT_SMART_ALERT_RULE } from "../../models/SmartAlert";
import {
  loadNotifications,
  markAsRead,
} from "../../viewmodels/home/NotificationsViewModel";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<
    AppNotification[]
  >([]);

  const refresh = useCallback(async () => {
    const result = await loadNotifications();

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    if (result.success) {
      setNotifications(result.notifications);
    } else {
      setNotifications([]);
      if (result.message) {
        Alert.alert("Notificaciones", result.message);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      setLoading(true);
      refresh();
    };

    onFocus();
    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
  }, [navigation, refresh]);

  async function handlePress(item: AppNotification) {
    if (item.read) return;

    const result = await markAsRead(item.id);

    if (!result.success) {
      Alert.alert(
        "Error",
        result.message ?? "No fue posible marcar como leída."
      );
      return;
    }

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === item.id ? { ...n, read: true } : n
      )
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.empty}>
        <View
          style={[
            styles.emptyIcon,
            {
              backgroundColor: theme.colors.soft,
              borderColor: theme.colors.accentBorder,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-sleep-outline"
            size={48}
            color={theme.colors.primary}
          />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No tienes notificaciones
        </Text>
        <Text
          style={[
            styles.emptySubtitle,
            { color: theme.colors.textSecondary },
          ]}
        >
          Cuando SafeRoute tenga alertas relevantes para ti,
          aparecerán aquí. En una fase posterior, los incidentes de
          riesgo alto podrán avisarte si estás a{" "}
          {DEFAULT_SMART_ALERT_RULE.radiusKm} km o menos de la zona.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PageHeader
        title="Notificaciones"
        subtitle="Centro de alertas de SafeRoute"
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.textSecondary },
            ]}
          >
            Cargando notificaciones...
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            notifications.length === 0 && styles.listEmpty,
          ]}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => handlePress(item)}
            />
          )}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 8,
  },

  listEmpty: {
    flexGrow: 1,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 56,
  },

  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
