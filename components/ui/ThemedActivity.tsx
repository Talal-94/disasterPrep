import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import { UnistylesRuntime } from "react-native-unistyles";

export default function ThemedActivity(props: ActivityIndicatorProps) {
  const t = UnistylesRuntime.getTheme();
  return <ActivityIndicator color={t.colors.primary} {...props} />;
}
