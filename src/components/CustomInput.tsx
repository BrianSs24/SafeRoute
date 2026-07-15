import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = TextInputProps;

export default function CustomInput(props: Props) {
  const theme = useAppTheme();

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          color: theme.colors.text,
        },
        props.style,
      ]}
      placeholderTextColor={theme.colors.textSecondary}
      returnKeyType={props.returnKeyType ?? "next"}
      blurOnSubmit={props.blurOnSubmit ?? false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    fontSize: 16,
  },
});
