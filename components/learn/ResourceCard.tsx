import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
  level: string;
  onPress?: () => void;
};

export default function ResourceCard({
  icon,
  title,
  description,
  time,
  level,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{time}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
  },
  dot: {
    marginHorizontal: 6,
    color: "#999",
  },
});
