// components/learn/UserProgress.tsx
import { View, Text, StyleSheet } from "react-native";
import BadgeCard from "./BadgeCard";
import { getLevelTitle } from "@/utils/level";

type Props = {
  level: number;
  xp: number;
  nextLevelXP: number;
  badges?: any[];
};

export default function UserProgress({
  level,
  xp,
  nextLevelXP,
  badges = [],
}: Props) {
  const progress = Math.min(xp / nextLevelXP, 1);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{getLevelTitle(level)}</Text>
          <Text style={styles.level}>Level {level}</Text>
        </View>
        <View style={styles.rightText}>
          <Text style={styles.xp}>{xp} XP</Text>
          <Text style={styles.next}>Next {nextLevelXP}</Text>
        </View>
      </View>

      <View style={styles.progressWrapper}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* 🔥 Show earned badges */}
      {badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.slice(0, 4).map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  level: {
    fontSize: 14,
    color: "#777",
  },
  rightText: {
    alignItems: "flex-end",
  },
  xp: {
    fontWeight: "bold",
    fontSize: 16,
  },
  next: {
    fontSize: 12,
    color: "#888",
  },
  progressWrapper: {
    height: 6,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-start",
  },
});
