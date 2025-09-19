// components/ui/Text.tsx
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Variant = "title" | "subtitle" | "body" | "muted" | "caption";
type Props = TextProps & { variant?: Variant };

export default function Text({ variant = "body", style, ...rest }: Props) {
  return <RNText {...rest} style={[styles[variant], style]} />;
}

const styles = StyleSheet.create((theme) => ({
  title: { color: theme.colors.text, ...theme.typography.title },
  subtitle: { color: theme.colors.text, ...theme.typography.subtitle },
  body: { color: theme.colors.text, ...theme.typography.body },
  muted: { color: theme.colors.muted, ...theme.typography.body },
  caption: { color: theme.colors.muted, ...theme.typography.caption },
})) as Record<Variant, TextStyle>;
