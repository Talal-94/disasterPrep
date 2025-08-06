import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
} from "react-native";
import { getWeatherAlerts } from "../../../services/weather";
import useLocation from "../../../utils/location";
import { useTranslation } from "react-i18next";

export default function AlertsScreen() {
  const { location, errorMsg } = useLocation();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>{t("alerts.header")}</Text>
        {errorMsg ? (
          <Text style={styles.error}>
            {t("alerts.errorPrefix")} {errorMsg}
          </Text>
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : alerts.length === 0 ? (
          <Text style={styles.noAlerts}>{t("alerts.noAlerts")}</Text>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.event}</Text>
                <Text style={styles.field}>
                  {t("alerts.from")}:{" "}
                  {new Date(item.start * 1000).toLocaleString(i18n.language)}
                </Text>
                <Text style={styles.field}>
                  {t("alerts.to")}:{" "}
                  {new Date(item.end * 1000).toLocaleString(i18n.language)}
                </Text>
                <Text style={styles.field}>
                  {t("alerts.sender")}: {item.sender_name}
                </Text>
                <Text style={styles.field}>
                  {t("alerts.description")}: {item.description}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAlerts: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
  card: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  field: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
