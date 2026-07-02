import { MaterialCommunityIcons } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar = forwardRef<TextInput, Props>(
  ({ value, onChangeText, onFocus, onBlur }, ref) =>  {

  return (

    <View style={styles.container}>

      <MaterialCommunityIcons
        name="magnify"
        size={26}
        color="#6B7280"
      />

      <TextInput
        ref={ref}
  style={styles.input}
  placeholder="¿A dónde quieres ir?"
  placeholderTextColor="#9CA3AF"
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

        <Pressable
          onPress={() => onChangeText("")}
        >

          <MaterialCommunityIcons
            name="close-circle"
            size={22}
            color="#9CA3AF"
          />

        </Pressable>

      )}

    </View>

  );

});

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

  backgroundColor: "#FFFFFF",

  borderRadius: 18,

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

    color: "#111827",

  },

});