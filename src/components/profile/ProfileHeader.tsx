import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  email: string;
  image?: string;
  primaryColor?: string;
  primaryDarkColor?: string;
};

export default function ProfileHeader({
  name,
  email,
  image,
  primaryColor = "#2563EB",
  primaryDarkColor = "#1D4ED8",
}: Props) {
  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>
      <View style={styles.avatarContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: primaryDarkColor },
            ]}
          >
            <MaterialCommunityIcons
              name="account"
              size={60}
              color="#FFFFFF"
            />
          </View>
        )}

        <Pressable
          style={[
            styles.editButton,
            { backgroundColor: primaryDarkColor },
          ]}
        >
          <MaterialCommunityIcons
            name="camera"
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 70,
    paddingBottom: 35,
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 18,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4F83FF",
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },

  email: {
    marginTop: 6,
    color: "#DBEAFE",
    fontSize: 16,
  },
});
