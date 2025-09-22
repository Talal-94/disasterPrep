import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Divider from "@/components/ui/Divider";
import { getLevelBounds, getLevelTitle } from "@/utils/userProgress.utils";
import { getBadgeIcon } from "../ui/badgeRegistry";
import i18n from "@/utils/locales/i18n";

type Props = {
  level: number;
  xp: number;
  nextLevelXP: number;
  badges: Array<{ id: string } & Record<string, any>>;
};

export default function UserProgress({
  level,
  xp,
  nextLevelXP,
  badges,
}: Props) {
  const { prevCap, nextCap } = getLevelBounds(xp);
  const ratio = Math.max(0, Math.min((xp - prevCap) / (nextCap - prevCap), 1));

  const preview = Array.isArray(badges) ? badges.slice(0, 8) : [];

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>Lv {level}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>
            {getLevelTitle(level, i18n.language)}
          </Text>
          <Text variant="muted" style={styles.subtitle}>
            {xp}/{nextLevelXP} XP
          </Text>
          <View style={styles.barWrap}>
            <View style={styles.barBg} />
            <View style={[styles.barFg, { width: `${ratio * 100}%` }]} />
          </View>
        </View>
      </View>

      {preview.length ? (
        <>
          <Divider />
          <View style={styles.badgesRow}>
            {preview.map((b) => (
              <Image
                key={b.id}
                source={getBadgeIcon(b.id)}
                style={{ width: 26, height: 26 }}
              />
            ))}
            {badges.length > preview.length ? (
              <Text variant="caption" style={styles.more}>
                +{badges.length - preview.length}
              </Text>
            ) : null}
          </View>
          <Text style={styles.Attribution} variant="caption">
            badge Icons made by Freepik from www.flaticon.com
          </Text>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing(1) },
  levelPill: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing(1),
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  levelText: { color: "#fff", fontWeight: "700" },

  right: { flex: 1 },
  title: { color: theme.colors.text, fontWeight: "700" },
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

  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
  },
  badgeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  more: { color: theme.colors.muted },
  Attribution: { marginVertical: theme.spacing(0.5) },
}));
