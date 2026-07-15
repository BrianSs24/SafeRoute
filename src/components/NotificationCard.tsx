import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";
import {
  AppNotification,
  NotificationPriority,
  NotificationType,
} from "../models/Notification";

type Props = {
  notification: AppNotification;
  onPress?: () => void;
};

function priorityColor(
  priority: NotificationPriority,
  colors: { danger: string; warning: string; success: string }
) {
  switch (priority) {
    case "alta":
      return colors.danger;
    case "media":
      return colors.warning;
    default:
      return colors.success;
  }
}

function typeIcon(type: NotificationType) {
  switch (type) {
    case "incidente":
      return "alert-octagon-outline";
    case "seguridad":
      return "shield-alert-outline";
    case "cuenta":
      return "account-outline";
    default:
      return "bell-outline";
  }
}

function formatDateTime(createdAt: any) {
  if (!createdAt?.seconds) {
    return { date: "Sin fecha", time: "--:--" };
  }

  const date = new Date(createdAt.seconds * 1000);

  return {
    date: date.toLocaleDateString("es-DO"),
    time: date.toLocaleTimeString("es-DO", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function NotificationCard({
  notification,
  onPress,
}: Props) {
  const theme = useAppTheme();
  const accent = priorityColor(notification.priority, theme.colors);
  const { date, time } = formatDateTime(notification.createdAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        !notification.read && {
          borderColor: theme.colors.accentBorder,
          backgroundColor: theme.colors.soft,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: accent + "18" },
        ]}
      >
        <MaterialCommunityIcons
          name={typeIcon(notification.type)}
          size={24}
          color={accent}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.read && (
            <View
              style={[
                styles.dot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          )}
        </View>

        <Text
          style={[styles.body, { color: theme.colors.textSecondary }]}
          numberOfLines={2}
        >
          {notification.body}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: accent },
            ]}
          >
            <Text style={styles.priorityText}>
              {notification.priority.toUpperCase()}
            </Text>
          </View>

          <Text
            style={[styles.meta, { color: theme.colors.textSecondary }]}
          >
            {date} · {time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  pressed: {
    opacity: 0.92,
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  body: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  priorityText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  meta: {
    fontSize: 12,
  },
});
