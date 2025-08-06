import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { firestore } from "@/utils/firebasee";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "@react-native-firebase/firestore";

type QuizMeta = {
  id: string;
  resourceId: string;
  title: string;
};

export default function QuizzesListScreen() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Fetch all quizzes
      const snap = await getDocs(collection(firestore, "quizzes"));

      // 2) For each quiz, look up its resource title
      const metas: QuizMeta[] = await Promise.all(
        snap.docs.map(async (qdoc: { data: () => any; id: any }) => {
          const q = qdoc.data() as any;
          let title = q.resourceId;

          // modular getDoc/doc
          const resSnap = await getDoc(
            doc(firestore, "resources", q.resourceId)
          );
          if (resSnap.exists()) {
            const res = resSnap.data() as any;
            title = res.title?.[i18n.language] || res.title?.en || q.resourceId;
          }

          return { id: qdoc.id, resourceId: q.resourceId, title };
        })
      );

      setQuizzes(metas);
    } catch (err) {
      console.error("❌ Error loading quizzes:", err);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={quizzes}
      keyExtractor={(q) => q.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.loader}>
          <Text>{t("learn.noQuizzesAvailable", "No quizzes available.")}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/learn/quizzes/${item.id}`)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {t("learn.takeQuiz", "Take Quiz")}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 16, flexGrow: 1 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
});
