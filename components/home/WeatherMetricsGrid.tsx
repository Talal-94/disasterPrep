import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface MetricProps {
  humidity: number;
  wind: number;
  visibility: number;
  pressure: number;
}

export default function WeatherMetricsGrid({
  humidity,
  wind,
  visibility,
  pressure,
}: MetricProps) {
  const { t } = useTranslation();

  return (
    <Card style={styles.card}>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Feather
            name="droplet"
            size={24}
            color={styles.icon.color as string}
          />
          <Text style={styles.value}>{humidity}%</Text>
          <Text variant="muted" style={styles.label}>
            {t("homescreen.humidity", "Humidity")}
          </Text>
        </View>

        <View style={styles.item}>
          <Feather name="wind" size={24} color={styles.icon.color as string} />
          <Text style={styles.value}>{wind} mph</Text>
          <Text variant="muted" style={styles.label}>
            {t("homescreen.windSpeed", "Wind Speed")}
          </Text>
        </View>

        <View style={styles.item}>
          <Ionicons
            name="eye-outline"
            size={24}
            color={styles.icon.color as string}
          />
          <Text style={styles.value}>{visibility} mi</Text>
          <Text variant="muted" style={styles.label}>
            {t("homescreen.visibility", "Visibility")}
          </Text>
        </View>

        <View style={styles.item}>
          <MaterialCommunityIcons
            name="speedometer"
            size={24}
            color={styles.icon.color as string}
          />
          <Text style={styles.value}>{pressure} in</Text>
          <Text variant="muted" style={styles.label}>
            {t("homescreen.pressure", "Pressure")}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  item: {
    alignItems: "center",
    width: "50%",
    marginBottom: theme.spacing(2),
  },
  icon: {
    color: theme.colors.text,
  },
  value: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 6,
  },
  label: {
    marginTop: 2,
  },
}));
