import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { UnistylesRuntime } from "react-native-unistyles";

type Props = React.ComponentProps<typeof Ionicons> & {
  tone?: "text" | "muted" | "primary" | "danger";
};

export default function ThemedIcon({ tone = "text", color, ...rest }: Props) {
  const t = UnistylesRuntime.getTheme();
  const palette = {
    text: t.colors.text,
    muted: t.colors.muted,
    primary: t.colors.primary,
    danger: t.colors.danger,
  } as const;
  return <Ionicons color={color ?? palette[tone]} {...rest} />;
}
