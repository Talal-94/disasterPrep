import React from "react";
import {
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

type Props = TextInputProps & { containerStyle?: StyleProp<ViewStyle> };

export default function Input({ style, containerStyle, ...rest }: Props) {
  const [focused, setFocused] = React.useState(false);

  const theme = UnistylesRuntime.getTheme();

  return (
    <View style={[styles.container, containerStyle, focused && styles.focused]}>
      <TextInput
        {...rest}
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.muted}
        selectionColor={theme.colors.primary}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  input: {
    color: theme.colors.text,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.25),
    fontSize: 16,
  },
}));
