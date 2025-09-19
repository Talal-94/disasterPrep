// components/ui/OptionButton.tsx
import React from "react";
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "./Text";

type Props = Omit<PressableProps, "style"> & {
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function OptionButton({
  label,
  selected,
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      {...rest}
      style={[
        styles.base,
        selected ? styles.selected : styles.unselected,
        style,
      ]}
    >
      <Text
        style={[styles.label, selected ? styles.labelSel : styles.labelUnsel]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingVertical: theme.spacing(1.25),
    paddingHorizontal: theme.spacing(1.5),
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unselected: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  label: { fontSize: 16, fontWeight: "600" },
  labelSel: { color: "#fff" },
  labelUnsel: { color: theme.colors.text },
}));
