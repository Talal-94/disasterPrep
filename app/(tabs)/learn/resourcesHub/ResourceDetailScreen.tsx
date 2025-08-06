// app/(tabs)/learn/resourcesHub/ResourceDetailScreen.tsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import useProgressSync from "@/hooks/useProgressSync";
import { useXPStore } from "@/store/xpStore";
import ConfettiLottie from "@/components/animation/ConfettiLottie";

import { firestore } from "@/utils/firebasee";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "@react-native-firebase/firestore";

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { markResourceAsRead } = useProgressSync();
  const { completedResources } = useXPStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const [resource, setResource] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isCompleted = !!resource && completedResources.includes(resource.id);
  const baseId = id.replace(/_(en|ar)$/, "");

  useEffect(() => {
    (async () => {
      // Load the resource document
      const resourceRef = doc(firestore, "resources", id);
      const resourceSnap = await getDoc(resourceRef);
      if (!resourceSnap.exists()) {
        setLoading(false);
        return;
      }
      setResource({ id: resourceSnap.id, ...(resourceSnap.data() as any) });

      // Load any quizzes linked to this resource
      const quizzesQuery = query(
        collection(firestore, "quizzes"),
        where("resourceId", "==", baseId)
      );
      const quizzesSnap = await getDocs(quizzesQuery);
      setQuizzes(
        quizzesSnap.docs.map((d: { id: any; data: () => any }) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );

      setLoading(false);
    })();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!resource) {
    return (
      <View style={styles.loader}>
        <Text>{t("learn.resourceNotFound", "Article not found")}</Text>
      </View>
    );
  }

  const title = resource.title?.[i18n.language] ?? resource.title?.en ?? "";
  const content =
    resource.content?.[i18n.language] ?? resource.content?.en ?? "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {resource.mediaUrl && (
        <Image
          source={{ uri: resource.mediaUrl }}
          style={styles.banner}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{content}</Text>

      <Text style={styles.quizHeading}>
        {t("learn.quizzesForResource", "Related Quizzes")}
      </Text>

      {quizzes.length === 0 ? (
        <Text style={styles.noQuizText}>
          {t("learn.noQuizzes", "There are no quizzes linked to this guide.")}
        </Text>
      ) : (
        quizzes.map((q) => (
          <TouchableOpacity
            key={q.id}
            style={styles.quizItem}
            onPress={() =>
              router.push({
                pathname: "../quizzes/[id]",
                params: { id: q.id },
              })
            }
          >
            <Text style={styles.quizQuestion}>{q.id}</Text>
            <Text style={styles.quizXp}>
              +{q.xpReward} {t("learn.xp", "XP")}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity
        style={[
          styles.completeButton,
          { backgroundColor: isCompleted ? "#ccc" : "#007AFF" },
        ]}
        onPress={() => {
          if (!isCompleted) {
            markResourceAsRead(resource.id, resource.xpValue);
            setShowConfetti(true);
          }
        }}
        disabled={isCompleted}
      >
        <Text style={styles.completeText}>
          {isCompleted
            ? t("learn.completed", "Completed")
            : t("learn.markAsRead", "Mark as Read")}
        </Text>
      </TouchableOpacity>

      {showConfetti && (
        <ConfettiLottie onFinish={() => setShowConfetti(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16 },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  quizHeading: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  noQuizText: { fontStyle: "italic", color: "#666" },
  quizItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
  },
  quizQuestion: { fontSize: 16 },
  quizXp: { fontSize: 12, color: "#007AFF", marginTop: 4 },
  completeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 32,
    alignItems: "center",
    width: "100%",
  },
  completeText: { color: "white", fontSize: 16, fontWeight: "600" },
});
