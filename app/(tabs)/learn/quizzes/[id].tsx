import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { firestore } from "@/utils/firebasee";
import { doc, getDoc } from "@react-native-firebase/firestore";
import useProgressSync from "@/hooks/useProgressSync";
import ConfettiLottie from "@/components/animation/ConfettiLottie";

type Question = {
  question: Record<string, string>;
  options?: any;
  correctIndex: number;
  xpReward: number;
};

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { markQuizAsComplete } = useProgressSync();

  const [quizData, setQuizData] = useState<{ questions: Question[] } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(firestore, "quizzes", id));
      if (snap.exists()) {
        setQuizData(snap.data() as any);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!quizData || !Array.isArray(quizData.questions)) {
    return (
      <View style={styles.loader}>
        <Text>{t("learn.quizNotFound", "Quiz not found")}</Text>
      </View>
    );
  }

  const questions = quizData.questions;
  const total = questions.length;
  if (total === 0) {
    return (
      <View style={styles.loader}>
        <Text>{t("learn.quizNoQuestions", "No questions available")}</Text>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  const langKey = i18n.language.split("-")[0]; // "en" or "ar"
  let optsArray: string[] = [];

  // normalize options
  if (currentQ.options) {
    if (
      Array.isArray(currentQ.options) &&
      typeof currentQ.options[0] === "string"
    ) {
      optsArray = currentQ.options;
    } else if (
      typeof currentQ.options === "object" &&
      Array.isArray(currentQ.options[langKey])
    ) {
      optsArray = currentQ.options[langKey];
    } else if (
      typeof currentQ.options === "object" &&
      Array.isArray(currentQ.options.en)
    ) {
      optsArray = currentQ.options.en;
    }
  }

  const questionText = currentQ.question[langKey] ?? currentQ.question.en ?? "";
  const totalXp = questions.reduce((sum, q) => sum + (q.xpReward || 0), 0);

  const handleAnswer = async (selected: number) => {
    const correct = selected === currentQ.correctIndex;
    Toast.show({
      type: correct ? "success" : "error",
      text1: correct
        ? t("learn.correct", "Correct!")
        : t("learn.incorrect", "Incorrect"),
    });

    if (currentIndex + 1 >= total) {
      setShowConfetti(true);
      await markQuizAsComplete(id, totalXp);
      setTimeout(() => router.back(), 2000);
    } else {
      setCurrentIndex((ci) => ci + 1);
    }
  };

  return (
    <View style={styles.container}>
      {showConfetti && (
        <ConfettiLottie onFinish={() => setShowConfetti(false)} />
      )}

      <Text style={styles.progress}>
        {t("learn.questionProgress", {
          current: currentIndex + 1,
          total,
        })}
      </Text>
      <View style={styles.progressBarWrapper}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentIndex + 1) / total) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.question}>{questionText}</Text>

      {optsArray.length === 0 ? (
        <Text style={styles.errorText}>
          {t("learn.noOptions", "No answer options available.")}
        </Text>
      ) : (
        optsArray.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.option}
            onPress={() => handleAnswer(idx)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16 },
  progress: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontStyle: "italic",
    marginTop: 12,
    textAlign: "center",
  },
});
