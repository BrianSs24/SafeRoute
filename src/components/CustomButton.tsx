import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
        },
        (loading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },

  buttonDisabled: {
    opacity: 0.75,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
