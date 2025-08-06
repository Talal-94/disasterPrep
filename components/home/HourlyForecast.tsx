import { FlatList, Text, View, StyleSheet } from "react-native";

export default function HourlyForecast({
  data,
}: {
  data: { hour: string; temp: number }[];
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.hour}>{item.hour}</Text>
            <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: 64,
  },
  hour: {
    fontSize: 14,
    color: "#555",
  },
  temp: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
});
