// app/(tabs)/learn/quizzes/[id].tsx
import { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { firestore } from "@/utils/firebasee";
import { doc, getDoc } from "@react-native-firebase/firestore";
import useProgressSync from "@/hooks/useProgressSync";
import ConfettiLottie from "@/components/animation/ConfettiLottie";
import Text from "@/components/ui/Text";

type Question = {
  question: Record<string, string>;
  options?: any;
  correctIndex: number;
};

type QuizDoc = {
  id?: string;
  questions: Question[];
  xpReward?: number; // <-- doc-level XP
  resourceId?: string;
};

const MIN_CONFETTI_MS = 1500;

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { markQuizAsComplete } = useProgressSync();

  const [quizData, setQuizData] = useState<QuizDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [locked, setLocked] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [awarded, setAwarded] = useState(false);

  const confettiStartedAt = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(firestore, "quizzes", id));
      if (snap.exists()) setQuizData(snap.data() as QuizDoc);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (
    !quizData ||
    !Array.isArray(quizData.questions) ||
    quizData.questions.length === 0
  ) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.loader}>
          <Text>{t("learn.quizNotFound", "Quiz not found")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const questions = quizData.questions;
  const total = questions.length;
  const currentQ = questions[currentIndex];
  const langKey = i18n.language.split("-")[0];

  // options normalize
  let optsArray: string[] = [];
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

  // ✅ Use doc-level xpReward; coerce to number
  const quizXp = Number(quizData.xpReward ?? 0);

  const handleAnswer = async (selected: number) => {
    if (locked) return;
    setLocked(true);

    const isCorrect = selected === currentQ.correctIndex;
    Toast.show({
      type: isCorrect ? "success" : "error",
      text1: isCorrect
        ? t("learn.correct", "Correct!")
        : t("learn.incorrect", "Incorrect"),
    });

    const isLast = currentIndex + 1 >= total;

    if (!isLast) {
      setResults((prev) => {
        const next = [...prev];
        next[currentIndex] = isCorrect;
        return next;
      });
      setCurrentIndex((ci) => ci + 1);
      setLocked(false);
      return;
    }

    // Final answer: check full quiz
    const allCorrect = [...results, isCorrect].every(Boolean);

    if (allCorrect) {
      setShowConfetti(true);
      confettiStartedAt.current = Date.now();

      if (!awarded && quizXp > 0) {
        const res = await markQuizAsComplete(id, quizXp);
        if (res?.awarded) {
          setAwarded(true);
          Toast.show({
            type: "success",
            text1: t("learn.rewards.taskComplete", { xp: quizXp }),
          });
        } else if (res?.reason === "already-completed") {
          Toast.show({
            type: "info",
            text1: t(
              "learn.alreadyCompleted",
              "You’ve already completed this quiz"
            ),
          });
        } else {
          Toast.show({
            type: "error",
            text1: t("learn.errorAward", "Could not record XP"),
          });
        }
      }
    } else {
      Toast.show({
        type: "info",
        text1: t("learn.tryAgain", "Not all answers were correct. Try again!"),
      });
      setCurrentIndex(0);
      setResults([]);
      setLocked(false);
    }
  };

  const handleConfettiFinish = () => {
    const started = confettiStartedAt.current ?? Date.now();
    const elapsed = Date.now() - started;
    const wait = Math.max(0, MIN_CONFETTI_MS - elapsed);
    setTimeout(() => {
      setShowConfetti(false);
      router.back();
    }, wait);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View style={styles.container}>
        <Text variant="caption" style={styles.progress}>
          {t("learn.questionProgress", { current: currentIndex + 1, total })}
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
            <Pressable
              key={idx}
              onPress={() => handleAnswer(idx)}
              disabled={locked}
              style={({ pressed }) => [
                styles.option,
                pressed && !locked && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          ))
        )}

        {/* Confetti overlay above everything */}
        {showConfetti && (
          <View pointerEvents="none" style={styles.overlay}>
            <ConfettiLottie onFinish={handleConfettiFinish} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  progress: {
    color: theme.colors.muted,
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: theme.spacing(2),
  },
  progressBarFill: { height: "100%", backgroundColor: theme.colors.primary },
  question: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing(1),
  },
  option: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.25),
    marginVertical: theme.spacing(0.75),
  },
  optionPressed: { opacity: 0.9 },
  optionText: { color: theme.colors.text, fontSize: 16 },
  errorText: {
    color: theme.colors.danger,
    fontStyle: "italic",
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
}));
