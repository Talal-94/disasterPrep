import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import Text from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = Omit<PressableProps, "style"> & {
  title: string;
  variant?: Variant;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create((theme) => ({
  base: {
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing(2),
    borderWidth: 1,
  },
  full: { width: "100%" as const },
  pressed: { opacity: 0.9 },

  // Container variants
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  danger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border,
  },

  // Label (Text) styles
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  label_primary: { color: "#FFFFFF" },
  label_secondary: { color: "#0B1220" },
  label_danger: { color: "#FFFFFF" },
  label_ghost: { color: theme.colors.text },
}));

export default function Button({
  title,
  variant = "primary",
  full,
  style,
  ...rest
}: Props) {
  const containerVariant = {
    primary: styles.primary,
    secondary: styles.secondary,
    danger: styles.danger,
    ghost: styles.ghost,
  }[variant];

  const labelVariant = {
    primary: styles.label_primary,
    secondary: styles.label_secondary,
    danger: styles.label_danger,
    ghost: styles.label_ghost,
  }[variant];

  const rippleColor = UnistylesRuntime.getTheme().colors.border;

  return (
    <Pressable
      {...rest}
      android_ripple={{ color: rippleColor, borderless: false }}
      style={({ pressed }) => [
        styles.base,
        containerVariant,
        full && styles.full,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text variant="body" style={[styles.label, labelVariant]}>
        {title}
      </Text>
    </Pressable>
  );
}
