import { MaterialCommunityIcons } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useAppTheme } from "../../context/AppSettingsContext";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar = forwardRef<TextInput, Props>(
  ({ value, onChangeText, onFocus, onBlur }, ref) => {
    const theme = useAppTheme();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={26}
          color={theme.colors.textSecondary}
        />

        <TextInput
          ref={ref}
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="¿A dónde quieres ir?"
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />

        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={22}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
    );
  }
);

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    left: 16,
    right: 16,
    height: 58,
    zIndex: 1000,
    elevation: 1000,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  input: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
  },
});
