import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CurrentWeatherCardProps {
  city: string;
  country?: string;
  description: string;
  temp: number;
  feelsLike: number;
}

export default function CurrentWeatherCard({
  city,
  country,
  description,
  temp,
  feelsLike,
}: CurrentWeatherCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.location}>
        {city}
        {country ? `, ${country}` : ""}
      </Text>
      <Text style={styles.subtitle}>Current Location</Text>

      <Ionicons
        name="sunny"
        size={80}
        color="#aaa"
        style={{ marginVertical: 16 }}
      />

      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.feelsLike}>Feels like {Math.round(feelsLike)}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  location: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
