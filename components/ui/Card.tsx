// // components/ui/Screen.tsx
// import { PropsWithChildren } from "react";
// import { View, ScrollView, ViewProps } from "react-native";
// import { StyleSheet } from "react-native-unistyles";

// type ScreenProps = PropsWithChildren<
//   ViewProps & { scroll?: boolean; padded?: boolean }
// >;

// export default function Screen({
//   children,
//   scroll,
//   padded = true,
//   style,
//   ...rest
// }: ScreenProps) {
//   const Container = scroll ? ScrollView : View;
//   return (
//     <Container
//       {...rest}
//       contentContainerStyle={
//         scroll ? [padded && styles.padded, style] : undefined
//       }
//       style={
//         !scroll
//           ? [styles.container, padded && styles.padded, style]
//           : styles.container
//       }
//     >
//       {children}
//     </Container>
//   );
// }

// const styles = StyleSheet.create((theme) => ({
//   container: {
//     // flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   padded: {
//     padding: theme.spacing(2),
//   },
// }));

// components/ui/Card.tsx
import React, { PropsWithChildren } from "react";
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
