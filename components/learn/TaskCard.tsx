import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  title: string;
  current: number;
  total: number;
  xp: number;
};

export default function TaskCard({ title, current, total, xp }: Props) {
  const earned = current >= total ? total : current;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.iconWrapper,
              current >= total && styles.iconComplete,
            ]}
          >
            <FontAwesome name="check" size={16} color="#fff" />
          </View>
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.progress}>
            Progress: {earned}/{total}
          </Text>
        </View>
      </View>
      <Text style={styles.xp}>+{xp} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#e0e0e0",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  texts: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  progress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  xp: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconComplete: {
    backgroundColor: "#4CAF50", // ✅ green when complete
  },
});
