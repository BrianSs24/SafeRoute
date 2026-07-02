import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { theme } from "../styles/theme";

type Props = {
  visible: boolean;
  title: string;
  options: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
};

export default function OptionModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <Text style={styles.title}>
            {title}
          </Text>

          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={styles.optionText}>
                {option}
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.cancel}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.colors.primary,
  },

  option: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  optionText: {
    fontSize: 17,
    color: theme.colors.text,
  },

  cancel: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#666",
  },

});