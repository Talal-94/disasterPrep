import { FlatList, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
export default function HourlyForecast({
  data,
  title = "Hourly Forecast",
}: {
  data: { hour: string; temp: number }[];
  title?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text variant="caption" style={styles.hour}>
              {item.hour}
            </Text>
            <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
  },
  title: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: theme.spacing(1),
  },
  list: { gap: theme.spacing(1) },
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1),
    alignItems: "center",
    width: 72,
  },
  hour: { color: theme.colors.muted },
  temp: { color: theme.colors.text, fontWeight: "800", fontSize: 16 },
}));
