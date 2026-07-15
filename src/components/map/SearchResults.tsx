import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "../../context/AppSettingsContext";

type Props = {
  data: any[];
  onSelect: (item: any) => void;
};

export default function SearchResults({ data, onSelect }: Props) {
  const theme = useAppTheme();

  if (!data.length) return null;

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
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.separator,
              { backgroundColor: theme.colors.border },
            ]}
          />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onSelect(item)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.soft },
              ]}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.textContainer}>
              <Text
                numberOfLines={1}
                style={[styles.title, { color: theme.colors.text }]}
              >
                {item.placePrediction.text.text}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.subtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                República Dominicana
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 123,
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 330,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  separator: {
    height: 1,
    marginLeft: 72,
  },
});
