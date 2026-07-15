import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

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
  const theme = useAppTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[
          styles.overlay,
          { backgroundColor: theme.colors.overlay },
        ]}
      >
        <View
          style={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {title}
          </Text>

          {options.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.option,
                { borderBottomColor: theme.colors.border },
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                {option}
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={[
              styles.cancel,
              { backgroundColor: theme.colors.mutedSurface },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.cancelText,
                { color: theme.colors.textSecondary },
              ]}
            >
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
    justifyContent: "flex-end",
  },

  modal: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  option: {
    paddingVertical: 18,
    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: 17,
  },

  cancel: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
