import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  xpReward: number;
  onStart: () => void;
};

export default function DailyQuizCard({ xpReward, onStart }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="book-outline" size={32} color="#888" />
      </View>
      <Text style={styles.title}>Test your knowledge</Text>
      <Text style={styles.subtitle}>
        Complete today’s quiz to earn {xpReward} XP
      </Text>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
