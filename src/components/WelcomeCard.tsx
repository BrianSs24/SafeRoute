import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  name: string;
  photoURL?: string;
  unreadCount?: number;
  onPressNotifications?: () => void;
};

export default function WelcomeCard({
  name,
  photoURL,
  unreadCount = 0,
  onPressNotifications,
}: Props) {
  const theme = useAppTheme();
  const hour = new Date().getHours();

  let greeting = "Buenos días";

  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes";
  } else if (hour >= 19 || hour < 6) {
    greeting = "Buenas noches";
  }

  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const showBadge = unreadCount > 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.primary },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.initial}>{initial}</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.message}>Tu seguridad comienza aquí.</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.notification}
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Centro de notificaciones"
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color="white"
        />

        {showBadge && (
          <View
            style={[
              styles.badge,
              { borderColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : String(unreadCount)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  initial: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  greeting: {
    color: "rgba(255,255,255,.9)",
    fontSize: 14,
  },

  name: {
    marginTop: 3,
    color: "#FFF",
    fontWeight: "700",
    fontSize: 24,
  },

  message: {
    marginTop: 5,
    color: "rgba(255,255,255,.88)",
    fontSize: 14,
  },

  notification: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
