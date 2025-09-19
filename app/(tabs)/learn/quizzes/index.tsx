import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { firestore } from "@/utils/firebasee";
import { collection, getDocs } from "@react-native-firebase/firestore";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";

export default function QuizzesListScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(collection(firestore, "quizzes"));
      setQuizzes(
        snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }))
      );
    } catch (e) {
      console.warn("Load quizzes failed", e);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    load();
  }, [load]);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.item}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/learn/quizzes/[id]",
            params: { id: item.id },
          })
        }
        style={({ pressed }) => [styles.itemPress, pressed && styles.pressed]}
      >
        <Text style={styles.title}>
          {item.title?.[i18n.language] ?? item.title?.en ?? item.id}
        </Text>
        <Text variant="caption" style={styles.meta}>
          +{item.xpReward} {t("learn.xp", "XP")}
        </Text>
      </Pressable>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={(q) => q.id}
        overScrollMode="always"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: {
    paddingHorizontal: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  item: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing(1),
  },
  itemPress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pressed: { opacity: 0.9 },
  title: { color: theme.colors.text, fontWeight: "700" },
  meta: { color: theme.colors.primary, marginTop: theme.spacing(0.25) },
}));
