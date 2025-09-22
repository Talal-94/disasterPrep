import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type CardProps = PropsWithChildren<ViewProps>;

export default function Card({ children, style, ...rest }: CardProps) {
  return (
    <View {...rest} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
  },
}));
