import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Divider from "@/components/ui/Divider";

type Props = {
  title: string;
  current: number;
  total: number;
  xp: number;
};

export default function TaskCard({ title, current, total, xp }: Props) {
  const progress = total > 0 ? Math.min(current / total, 1) : 0;
  const completed = progress >= 1;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.check,
            completed ? styles.checkDone : styles.checkTodo,
          ]}
        >
          <Text style={styles.checkMark}>{completed ? "✓" : " "}</Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.title}>{title}</Text>
          <Text variant="muted" style={styles.subtitle}>
            Progress: {current}/{total}
          </Text>

          <View style={styles.barWrap}>
            <View style={styles.barBg} />
            <View style={[styles.barFg, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <Text style={styles.xp}>+{xp} XP</Text>
      </View>

      <Divider />
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.25),
    marginBottom: theme.spacing(1),
  },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing(1) },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkTodo: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  checkDone: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkMark: { color: "#fff", fontWeight: "700" },

  main: { flex: 1 },
  title: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
  subtitle: { marginTop: theme.spacing(0.25) },

  barWrap: {
    marginTop: theme.spacing(0.75),
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  barBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.border,
    borderRadius: 999,
  },
  barFg: {
    height: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
  },

  xp: {
    color: theme.colors.text,
    fontWeight: "700",
    marginLeft: theme.spacing(1),
  },
}));
