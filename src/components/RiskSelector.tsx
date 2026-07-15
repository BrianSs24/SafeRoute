import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/AppSettingsContext";

type Props = {
  value: string;
  onChange: (risk: string) => void;
};

const risks = [
  { label: "Bajo", color: "#22C55E" },
  { label: "Medio", color: "#FACC15" },
  { label: "Alto", color: "#EF4444" },
];

export default function RiskSelector({ value, onChange }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Nivel de riesgo
      </Text>

      <View style={styles.row}>
        {risks.map((risk) => {
          const selected = value === risk.label;

          return (
            <Pressable
              key={risk.label}
              onPress={() => onChange(risk.label)}
              style={[
                styles.button,
                {
                  backgroundColor: selected
                    ? risk.color
                    : theme.colors.surface,
                  borderColor: selected ? risk.color : theme.colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: selected ? "#FFFFFF" : risk.color,
                  fontWeight: "bold",
                }}
              >
                {risk.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  title: {
    marginBottom: 10,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
});
