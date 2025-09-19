import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/components/ui/Card";

export default function SkeletonResourceCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.lineLong} />
          <View style={styles.lineShort} />
          <View style={styles.meta} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    padding: theme.spacing(1.25),
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  row: { flexDirection: "row", gap: theme.spacing(1) },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.border,
  },
  content: { flex: 1 },
  lineLong: {
    height: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(0.5),
    width: "80%",
  },
  lineShort: {
    height: 14,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(0.5),
    width: "60%",
  },
  meta: {
    height: 12,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    width: "40%",
    marginTop: theme.spacing(0.5),
  },
}));
