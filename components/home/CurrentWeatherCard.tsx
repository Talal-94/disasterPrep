import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { useTranslation } from "react-i18next";

interface CurrentWeatherCardProps {
  city: string;
  country?: string;
  description: string;
  temp: number;
  feelsLike: number;
  /** OpenWeather condition id, e.g. 800 = clear, 2xx = thunderstorm, etc. */
  conditionId?: number;
  /** OpenWeather icon code, e.g. "01d", "10n" (optional, for day/night nuance) */
  iconCode?: string;
}

function mapWeatherToIonicon(id?: number, iconCode?: string): string {
  if (typeof id !== "number") return "partly-sunny";

  // OpenWeather groups:
  // 2xx Thunderstorm, 3xx Drizzle, 5xx Rain, 6xx Snow, 7xx Atmosphere,
  // 800 Clear, 801-804 Clouds
  if (id >= 200 && id < 300) return "thunderstorm";
  if (id >= 300 && id < 400) return "rainy"; // drizzle
  if (id === 511) return "snow"; // freezing rain
  if (id >= 500 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "cloudy"; // mist/fog/smoke/haze etc.

  if (id === 800) {
    // clear sky — use day/night if we have the icon code
    if (iconCode && iconCode.endsWith("n")) return "moon";
    return "sunny";
  }
  if (id > 800 && id < 805) {
    // clouds
    if (iconCode && iconCode.endsWith("n")) return "cloudy-night";
    return "cloudy";
  }

  return "partly-sunny";
}

export default function CurrentWeatherCard({
  city,
  country,
  description,
  temp,
  feelsLike,
  conditionId,
  iconCode,
}: CurrentWeatherCardProps) {
  const { t } = useTranslation();
  const iconName = mapWeatherToIonicon(conditionId, iconCode);

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Text style={styles.location}>
          {city}
          {country ? `, ${country}` : ""}
        </Text>
        <Text variant="muted" style={styles.subtitle}>
          {t("homescreen.currentLocation", "Current Location")}
        </Text>

        <Ionicons
          name={iconName as any}
          size={80}
          color={styles.icon.color as string}
          style={{ marginVertical: 16 }}
        />

        <Text style={styles.temp}>{Math.round(temp)}°C</Text>
        <Text style={styles.description}>{description}</Text>
        <Text variant="muted" style={styles.feelsLike}>
          {t("homescreen.feelsLike", "Feels like")} {Math.round(feelsLike)}°C
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing(2),
    marginTop: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(1.5),
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },
  container: { alignItems: "center" },
  location: { color: theme.colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    marginBottom: theme.spacing(1),
  },
  icon: { color: theme.colors.muted },
  temp: { color: theme.colors.text, fontSize: 48, fontWeight: "800" },
  description: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "capitalize",
  },
  feelsLike: { marginTop: 4 },
}));
