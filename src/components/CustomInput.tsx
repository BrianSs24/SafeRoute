import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

import { theme } from "../styles/theme";

type Props = TextInputProps;

export default function CustomInput(props: Props) {
  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        props.style,
      ]}
      placeholderTextColor={
        theme.colors.textSecondary
      }
      returnKeyType={
        props.returnKeyType ?? "next"
      }
      blurOnSubmit={
        props.blurOnSubmit ?? false
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
  },
});