// import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Text, View } from "react-native";
// import { registerUserDevice } from "../../utils/registerUserDevice";

// export default function HomeScreen() {
//   const { t } = useTranslation();

//   useEffect(() => {
//     registerUserDevice();
//   }, []);

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>{t("homescreen.weatherDetails")}</Text>
//       <Text>{t("homescreen.welcome")}</Text>
//     </View>
//   );
// }

// app/(tabs)/index.tsx
import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import useLocation from "../../../utils/location";
import { registerUserDevice } from "../../../utils/registerUserDevice";
import { getWeatherData } from "../../../services/weather";
import CurrentWeatherCard from "../../../components/home/CurrentWeatherCard";
import HourlyForecast from "../../../components/home/HourlyForecast";
import DailyForecast from "../../../components/home/DailyForecast";
import WeatherMetricsGrid from "../../../components/home/WeatherMetricsGrid ";

export default function HomeScreen() {
  const { t } = useTranslation();
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
      <View style={styles.center}>
        <Text>{t("homescreen.locationError", { error: errorMsg })}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { current, hourly, daily } = weather;

  const hourlyData = hourly.slice(0, 8).map((h: any) => ({
    hour: `${new Date(h.dt * 1000).getHours()}:00`,
    temp: h.temp,
  }));
  const dailyData = daily.slice(0, 5).map((d: any) => ({
    day: new Date(d.dt * 1000).toLocaleDateString(undefined, {
      weekday: "short",
    }),
    min: d.temp.min,
    max: d.temp.max,
  }));

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <CurrentWeatherCard
          city={city || t("homescreen.unknownLocation")}
          description={current.weather[0].description}
          temp={current.temp}
          feelsLike={current.feels_like}
        />

        <WeatherMetricsGrid
          humidity={current.humidity}
          wind={current.wind_speed}
          visibility={current.visibility}
          pressure={current.pressure}
        />

        <HourlyForecast data={hourlyData} />

        <DailyForecast data={dailyData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
