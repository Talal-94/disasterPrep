import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "@/components/ui/Text";

export default function DailyForecast({
  data,
  title = "Daily Forecast",
}: {
  data: { day: string; min: number; max: number }[];
  title?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.spacing(2.5),
    paddingHorizontal: theme.spacing(2),
  },
  title: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: theme.spacing(1),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  day: { color: theme.colors.text, fontSize: 15 },
  temp: { color: theme.colors.text, fontSize: 15, fontWeight: "600" },
}));
