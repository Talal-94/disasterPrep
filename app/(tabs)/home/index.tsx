import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

import useLocation from "../../../utils/location";
import { registerUserDevice } from "../../../utils/registerUserDevice";
import { getWeatherData } from "../../../services/weather";

import Text from "@/components/ui/Text";
import CurrentWeatherCard from "@/components/home/CurrentWeatherCard";
import HourlyForecast from "@/components/home/HourlyForecast";
import DailyForecast from "@/components/home/DailyForecast";
import WeatherMetricsGrid from "@/components/home/WeatherMetricsGrid";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { location, city, errorMsg } = useLocation();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerUserDevice();
  }, []);

  useEffect(() => {
    if (!location) return;
    (async () => {
      try {
        const data = await getWeatherData(
          location.coords.latitude,
          location.coords.longitude
        );
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.center}>
          <Text>{t("homescreen.locationError", { error: errorMsg })}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const { current, hourly, daily } = weather;

  const hourlyData = hourly.slice(0, 8).map((h: any) => ({
    hour: `${new Date(h.dt * 1000).getHours()}:00`,
    temp: h.temp,
  }));
  const dailyData = daily.slice(0, 5).map((d: any) => ({
    day: new Date(d.dt * 1000).toLocaleDateString(i18n.language, {
      weekday: "short",
    }),
    min: d.temp.min,
    max: d.temp.max,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <CurrentWeatherCard
          city={city || t("homescreen.unknownLocation", "Unknown")}
          description={current.weather[0].description}
          temp={current.temp}
          feelsLike={current.feels_like}
          conditionId={current.weather[0]?.id}
          iconCode={current.weather[0]?.icon}
        />

        <WeatherMetricsGrid
          humidity={current.humidity}
          wind={current.wind_speed}
          visibility={current.visibility}
          pressure={current.pressure}
        />

        <HourlyForecast
          data={hourlyData}
          title={t("homescreen.hourlyForecast", "Hourly Forecast")}
        />

        <DailyForecast
          data={dailyData}
          title={t("homescreen.dailyForecast", "Daily Forecast")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingBottom: theme.spacing(3),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
}));
