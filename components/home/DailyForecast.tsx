import { View, Text, StyleSheet } from "react-native";

export default function DailyForecast({
  data,
}: {
  data: { day: string; min: number; max: number }[];
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Forecast</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.day}>{item.day}</Text>
          <Text style={styles.temp}>
            {Math.round(item.max)}° / {Math.round(item.min)}°
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  day: {
    fontSize: 15,
    color: "#333",
  },
  temp: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
