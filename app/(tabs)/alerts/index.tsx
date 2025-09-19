import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { getWeatherAlerts } from "../../../services/weather";
import useLocation from "../../../utils/location";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Divider from "@/components/ui/Divider";
import ThemedActivity from "@/components/ui/ThemedActivity";

// Infer your service's item type
type WeatherAlert = Awaited<
  ReturnType<typeof getWeatherAlerts>
> extends (infer T)[]
  ? T
  : never;

export default function AlertsScreen() {
  const { location, errorMsg } = useLocation();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!location) return;
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const { latitude, longitude } = location.coords;
        const data = await getWeatherAlerts(latitude, longitude);
        setAlerts(data);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [location]);

  // Map whatever the API returns to view fields (no API shape assumptions here)
  const toView = (a: WeatherAlert) => {
    const x = a as any;
    const title =
      x.title ??
      x.event ??
      x.headline ??
      x.name ??
      t("alerts.untitled", "Alert");
    const body = x.body ?? x.description ?? x.text ?? x.message ?? "";
    const severityRaw = x.severity ?? x.severityLevel ?? x.level ?? "info";
    const severity = String(severityRaw).toLowerCase();
    const ts =
      x.timestampText ??
      x.effective ??
      x.onset ??
      x.createdAt ??
      x.sent ??
      null;

    let timestampText = "";
    if (ts) {
      const d =
        ts instanceof Date
          ? ts
          : typeof ts === "number"
          ? new Date(ts)
          : typeof ts === "string"
          ? new Date(ts)
          : null;
      timestampText = d ? d.toLocaleString() : "";
    }
    return { title, body, severity, timestampText };
  };

  const renderItem = ({ item }: { item: WeatherAlert }) => {
    const v = toView(item);
    const toneStyle =
      v.severity === "critical"
        ? styles.crit
        : v.severity === "warning"
        ? styles.warn
        : styles.info;

    return (
      <Card style={styles.alert}>
        <View style={styles.row}>
          <Text variant="subtitle" style={styles.title}>
            {v.title}
          </Text>
          {v.severity ? (
            <View style={[styles.badge, toneStyle]}>
              <Text variant="caption" style={styles.badgeText}>
                {v.severity}
              </Text>
            </View>
          ) : null}
        </View>

        {v.timestampText ? (
          <Text variant="caption" style={styles.meta}>
            {v.timestampText}
          </Text>
        ) : null}

        <Divider />
        <Text style={styles.body}>{v.body}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Screen>
        <Text variant="title" style={styles.header}>
          {t("alerts.header")}
        </Text>

        {errorMsg ? (
          <Text style={styles.error}>
            {t("alerts.errorPrefix")} {errorMsg}
          </Text>
        ) : loading ? (
          <View style={styles.center}>
            <ThemedActivity size="large" />
          </View>
        ) : alerts.length === 0 ? (
          <Text style={styles.noAlerts}>{t("alerts.noAlerts")}</Text>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  header: { marginBottom: theme.spacing(1.5) },

  listContent: { paddingBottom: theme.spacing(3) },

  alert: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1),
  },
  title: { color: theme.colors.text, fontWeight: "700" },
  meta: { color: theme.colors.muted, marginTop: theme.spacing(0.25) },
  body: { color: theme.colors.text, marginTop: theme.spacing(1) },

  badge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing(1),
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeText: { color: "#fff" },

  info: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  warn: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  },
  crit: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },

  error: { color: theme.colors.danger, marginBottom: theme.spacing(1) },
  noAlerts: { color: theme.colors.muted },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
}));
