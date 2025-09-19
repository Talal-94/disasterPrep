// components/ui/Divider.tsx
import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Divider(props: ViewProps) {
  return <View {...props} style={[styles.line, props.style]} />;
}

const styles = StyleSheet.create((theme) => ({
  line: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing(1),
  },
}));
