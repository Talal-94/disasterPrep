import React from "react";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  level: string;
  onPress?: () => void;
};

export default function ResourceCard({
  icon,
  title,
  description,
  level,
  onPress,
}: Props) {
  return (
    <Card style={styles.card}>
      <Pressable onPress={onPress} style={styles.row}>
        <View style={styles.avatar}>{icon ?? <Text>📘</Text>}</View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.metaRow}>
            <Text variant="caption" style={styles.meta}>
              {level}
            </Text>
          </View>
        </View>
      </Pressable>
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
    marginBottom: theme.spacing(1),
  },
  row: { flexDirection: "row", gap: theme.spacing(1) },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  content: { flex: 1 },
  title: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
  desc: {
    color: theme.colors.muted,
    marginTop: theme.spacing(0.5),
    fontSize: 13,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing(0.75),
  },
  meta: { color: theme.colors.muted },
  dot: { color: theme.colors.muted },
}));
