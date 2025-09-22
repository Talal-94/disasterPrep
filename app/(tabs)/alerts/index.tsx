import { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Divider from "@/components/ui/Divider";
import ThemedActivity from "@/components/ui/ThemedActivity";
import useLocation from "@/utils/location";
import { getWeatherAlerts } from "@/services/weather";

// OpenWeather One Call 3.0 alert shape according to their docs: https://openweathermap.org/api/one-call-3
type WeatherAlert = {
  sender_name: string;
  event: string;
  start?: number;
  end?: number;
  description: string;
  tags?: string[];
};

type Tone = "info" | "warning" | "critical";

function deriveTone(tags: string[], event: string): Tone {
  const t = tags.map((s) => s.toLowerCase());
  const e = event.toLowerCase();

  const critical = [
    "heat",
    "flood",
    "hurricane",
    "tornado",
    "wildfire",
    "blizzard",
  ].some((k) => t.includes(k) || e.includes(k));

  if (critical) return "critical";

  const warning = [
    "sandstorm",
    "dust",
    "low visibility",
    "thunderstorm",
    "air pollution",
    "pm10",
  ].some((k) => t.includes(k) || e.includes(k));

  return warning ? "warning" : "info";
}

function fmtWindow(start?: number, end?: number, locale?: string) {
  const fmt = (sec: number) => new Date(sec * 1000).toLocaleString(locale);
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  if (start) return fmt(start);
  if (end) return fmt(end);
  return "";
}
// in case you want to try how it looks:
const mockAlerts = [
  {
    sender_name: "NCM (Saudi Arabia)",
    event: "Sandstorm Warning",
    start: 1737541200,
    end: 1737555600,
    description:
      "Reduced visibility expected due to blowing sand/dust. Avoid travel where possible, keep windows and doors closed, and use dust masks if going outdoors.",
    tags: ["Sandstorm", "Dust", "Low Visibility"],
  },
  {
    sender_name: "NCM Air Quality",
    event: "Air Quality Advisory",
    start: 1737523200,
    end: 1737609600,
    description:
      "Elevated PM10 levels likely during the afternoon and evening. Sensitive groups (asthma, bronchitis) should limit prolonged or heavy exertion outdoors. Consider indoor air purification.",
    tags: ["Air Pollution", "PM10"],
  },
  {
    sender_name: "Ministry of Health",
    event: "Heat Health Warning",
    start: 1737566400,
    end: 1737652800,
    description:
      "High temperatures with dry winds can lead to dehydration and heat exhaustion. Stay hydrated, minimize midday outdoor activity, and check on vulnerable individuals.",
    tags: ["Heat", "Health"],
  },
];

export default function AlertsScreen() {
  const { t, i18n } = useTranslation();
  const { location, errorMsg } = useLocation();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    (async () => {
      setLoading(true);
      try {
        const { latitude, longitude } = location.coords;
        const data = await getWeatherAlerts(latitude, longitude, i18n.language);
        setAlerts(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  const items = useMemo(
    () =>
      alerts.map((a, idx) => {
        const { event, description, sender_name, start, end, tags = [] } = a;

        const tone = deriveTone(tags, event);
        const windowText = fmtWindow(start, end, i18n.language);
        const badgeText = (tags[0] || tone).toLowerCase();

        return {
          key: `${event}-${start ?? 0}-${end ?? idx}`,
          title: event || t("alerts.untitled", "Alert"),
          body: description,
          source: sender_name,
          windowText,
          badgeText,
          tone,
          tags,
        };
      }),
    [alerts, i18n.language, t]
  );

  const renderItem = ({ item }: { item: (typeof items)[number] }) => {
    const toneStyle =
      item.tone === "critical"
        ? styles.crit
        : item.tone === "warning"
        ? styles.warn
        : styles.info;

    return (
      <Card style={styles.alert}>
        <View style={styles.row}>
          <Text variant="subtitle" style={styles.title}>
            {item.title}
          </Text>
          <View style={[styles.badge, toneStyle]}>
            <Text variant="caption" style={styles.badgeText}>
              {item.badgeText}
            </Text>
          </View>
        </View>

        {(item.source || item.windowText) && (
          <Text variant="caption" style={styles.meta}>
            {[item.source, item.windowText].filter(Boolean).join(" • ")}
          </Text>
        )}

        <Divider />
        <Text style={styles.body}>{item.body}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Screen>
        <Text variant="title" style={styles.header}>
          {t("alerts.header", "Weather Alerts")}
        </Text>

        {errorMsg ? (
          <Text style={styles.error}>
            {t("alerts.errorPrefix", "Location error:")} {errorMsg}
          </Text>
        ) : loading ? (
          <View style={styles.center}>
            <ThemedActivity size="large" />
          </View>
        ) : items.length === 0 ? (
          <Text style={styles.noAlerts}>
            {t("alerts.noAlerts", "No active alerts in your area.")}
          </Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => it.key}
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
    borderRadius: theme.radius.lg,
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
  title: { color: theme.colors.text, fontWeight: "400" },
  meta: { color: theme.colors.muted, marginTop: theme.spacing(0.5) },
  body: { color: theme.colors.text, marginVertical: theme.spacing(2) },

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

  // tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  tagChip: {
    paddingHorizontal: theme.spacing(0.75),
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.muted ?? theme.colors.border,
  },
  tagText: {
    color: theme.colors.muted,
  },

  // states
  error: { color: theme.colors.danger, marginBottom: theme.spacing(1) },
  noAlerts: { color: theme.colors.muted },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
}));
