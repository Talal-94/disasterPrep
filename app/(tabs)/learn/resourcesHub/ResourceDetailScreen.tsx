import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
import { SafeAreaView } from "react-native-safe-area-context";

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
      const resourceRef = doc(firestore, "resources", id);
      const resourceSnap = await getDoc(resourceRef);
      if (!resourceSnap.exists()) {
        setLoading(false);
        return;
      }
      setResource({ id: resourceSnap.id, ...(resourceSnap.data() as any) });

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
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
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
            <Card key={q.id} style={styles.quizCard}>
              <TouchableOpacity
                style={styles.quizPress}
                onPress={() =>
                  router.push({
                    pathname: "../quizzes/[id]",
                    params: { id: q.id },
                  })
                }
              >
                <Text style={styles.quizQuestion}>
                  {q.title?.[i18n.language] ?? q.title?.en ?? q.id}
                </Text>
                <Text style={styles.quizXp}>
                  +{q.xpReward} {t("learn.xp", "XP")}
                </Text>
              </TouchableOpacity>
            </Card>
          ))
        )}

        <Button
          title={
            isCompleted
              ? t("learn.completed", "Completed")
              : t("learn.markAsRead", "Mark as Read")
          }
          onPress={() => {
            if (!isCompleted) {
              markResourceAsRead(resource.id, resource.xpValue);
              setShowConfetti(true);
            }
          }}
          disabled={isCompleted}
          full
          style={styles.cta}
        />

        {showConfetti && (
          <ConfettiLottie onFinish={() => setShowConfetti(false)} />
        )}
        <Text style={styles.lottieAttribution} variant="caption">
          Lottie animation coming from lottiefiles.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingHorizontal: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },

  banner: {
    width: "100%",
    height: 180,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: theme.spacing(1),
  },
  body: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing(3),
  },

  quizHeading: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing(1),
  },
  noQuizText: { fontStyle: "italic", color: theme.colors.muted },

  quizCard: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.25),
    marginBottom: theme.spacing(1),
  },
  quizPress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizQuestion: { color: theme.colors.text, fontSize: 16, fontWeight: "600" },
  quizXp: {
    color: theme.colors.primary,
    fontSize: 13,
    marginTop: theme.spacing(0.25),
  },

  cta: { marginTop: theme.spacing(2) },
  lottieAttribution: { marginVertical: theme.spacing(2) },
}));
