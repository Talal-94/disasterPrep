import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type Badge = {
  id: string;
  title: { [lang: string]: string }; // ✅ updated
  icon?: string; // optional if you want emojis
};

export default function BadgeCard({ badge }: { badge: Badge }) {
  const { i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{badge.icon ?? "🏅"}</Text>
      <Text style={styles.name}>
        {badge.title?.[i18n.language] ?? badge.title?.en ?? ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 8,
    width: 50, // ✅ shrink width
  },
  icon: {
    fontSize: 20, // ✅ smaller emoji
    marginBottom: 2,
  },
  name: {
    fontSize: 10, // ✅ more compact label
    textAlign: "center",
  },
});
