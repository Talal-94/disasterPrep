// import { View, Text, StyleSheet } from "react-native";
// import { useTranslation } from "react-i18next";

// type Badge = {
//   id: string;
//   title: { [lang: string]: string }; // ✅ updated
//   icon?: string; // optional if you want emojis
// };

// export default function BadgeCard({ badge }: { badge: Badge }) {
//   const { i18n } = useTranslation();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.icon}>{badge.icon ?? "🏅"}</Text>
//       <Text style={styles.name}>
//         {badge.title?.[i18n.language] ?? badge.title?.en ?? ""}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     marginRight: 8,
//     width: 50, // ✅ shrink width
//   },
//   icon: {
//     fontSize: 20, // ✅ smaller emoji
//     marginBottom: 2,
//   },
//   name: {
//     fontSize: 10, // ✅ more compact label
//     textAlign: "center",
//   },
// });

// components/learn/BadgeCard.tsx
import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "@/components/ui/Text";

type Badge = { id: string; title: Record<string, string>; icon?: string };

export default function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{badge.icon ?? "🏅"}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {badge.title?.en ?? badge.id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    marginRight: theme.spacing(0.5),
    width: 56,
  },
  icon: { fontSize: 22, marginBottom: 4 },
  name: { color: theme.colors.muted, fontSize: 11, textAlign: "center" },
}));
