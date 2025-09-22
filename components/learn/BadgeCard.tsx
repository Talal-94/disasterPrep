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
