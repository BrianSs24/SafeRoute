import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {

  data: any[];

  onSelect: (item: any) => void;

};

export default function SearchResults({
  data,
  onSelect,
}: Props) {

  if (!data.length) return null;

  return (

    <View style={styles.container}>

      <FlatList

        data={data}

        keyExtractor={(_, index) =>
          index.toString()
        }

        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}

        renderItem={({ item }) => (

          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onSelect(item)}
          >

            <View style={styles.iconContainer}>

              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color="#2563EB"
              />

            </View>

            <View style={styles.textContainer}>

              <Text
                numberOfLines={1}
                style={styles.title}
              >
                {item.placePrediction.text.text}
              </Text>

              <Text
                numberOfLines={1}
                style={styles.subtitle}
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

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    maxHeight: 330,

    elevation: 10,

    shadowColor: "#000",

    shadowOpacity: .10,

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

    backgroundColor: "#EEF5FF",

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

    color: "#111827",

  },

  subtitle: {

    marginTop: 3,

    color: "#6B7280",

    fontSize: 13,

  },

  separator: {

    height: 1,

    backgroundColor: "#F3F4F6",

    marginLeft: 72,

  },

});