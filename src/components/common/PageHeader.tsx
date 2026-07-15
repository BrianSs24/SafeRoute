import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../../context/AppSettingsContext";

type Props = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  iconColor?: string;
  backBackgroundColor?: string;
};

export default function PageHeader({
  title,
  subtitle,
  backgroundColor,
  titleColor,
  subtitleColor,
  iconColor,
  backBackgroundColor,
}: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? theme.colors.surface,
        },
      ]}
    >
      <Pressable
        style={[
          styles.backButton,
          {
            backgroundColor:
              backBackgroundColor ?? theme.colors.mutedSurface,
          },
        ]}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={iconColor ?? theme.colors.text}
        />
      </Pressable>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: titleColor ?? theme.colors.text },
          ]}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: subtitleColor ?? theme.colors.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
  },
});
