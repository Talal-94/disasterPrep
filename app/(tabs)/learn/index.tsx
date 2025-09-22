import { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { useXPStore } from "@/store/xpStore";
import useProgressSync from "@/hooks/useProgressSync";

import UserProgress from "../../../components/learn/UserProgress";
import ResourceCard from "../../../components/learn/ResourceCard";
import SkeletonResourceCard from "../../../components/learn/SkeletonResourceCard";
import TaskCard from "../../../components/learn/TaskCard";
import RewardCelebration from "@/components/animation/RewardCelebration";

import Screen from "@/components/ui/Screen";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

import { firestore } from "@/utils/firebasee";
import {
  collection,
  getDocs,
  query,
  limit,
} from "@react-native-firebase/firestore";

export default function LearnScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [resources, setResources] = useState<any[]>([]);
  const [taskDefs, setTaskDefs] = useState<any[]>([]);
  const [badgeDefs, setBadgeDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    xp,
    level,
    completedResources,
    completedQuizzes,
    badges: earned,
    rewardEvent,
    clearReward,
  } = useXPStore();

  useProgressSync();

  const fetchResources = useCallback(async () => {
    try {
      const snap = await getDocs(
        query(collection(firestore, "resources"), limit(3))
      );
      setResources(
        snap.docs.map((d: { id: any; data: () => any }) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const snap = await getDocs(collection(firestore, "tasks"));
      setTaskDefs(
        snap.docs.map((d: { id: any; data: () => any }) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [i18n.language]);

  const fetchBadges = useCallback(async () => {
    try {
      const snap = await getDocs(collection(firestore, "badges"));
      setBadgeDefs(
        snap.docs.map((d: { id: any; data: () => any }) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  }, [i18n.language]);

  useEffect(() => {
    (async () => {
      await Promise.all([fetchResources(), fetchTasks(), fetchBadges()]);
      setLoading(false);
    })();
  }, [fetchResources, fetchTasks, fetchBadges]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchResources(), fetchTasks(), fetchBadges()]);
    setRefreshing(false);
  }, [fetchResources, fetchTasks, fetchBadges]);

  const renderResource = useCallback(
    ({ item }: { item: any }) => {
      const localizedContent = item.content?.[i18n.language] ?? "";
      return (
        <ResourceCard
          icon={<Text>📘</Text>}
          title={item.title[i18n.language]}
          description={localizedContent.slice(0, 60) + "…"}
          level={t(`categories.${item.hazardType}`)}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/learn/resourcesHub/ResourceDetailScreen",
              params: { id: item.id },
            })
          }
        />
      );
    },
    [router, t, i18n.language]
  );

  const ListHeader = () => (
    <View>
      <UserProgress
        level={level}
        xp={xp}
        nextLevelXP={level * 100}
        badges={badgeDefs.filter((b) => earned.includes(b.id))}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("learn.resourcesHub")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/learn/resourcesHub")}
        >
          <Text style={styles.viewAll}>{t("learn.viewAll")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.sectionTitle}>{t("learn.quizzes")}</Text>

      <Button
        title={t("learn.startQuiz")}
        onPress={() => router.push("/learn/quizzes")}
        full
      />

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        {t("learn.tasksChallenges")}
      </Text>
      {taskDefs.map((task) => {
        let current = 0;
        if (task.type === "resourceRead") current = completedResources.length;
        else if (task.type === "quizComplete")
          current = completedQuizzes.length;
        return (
          <TaskCard
            key={task.id}
            title={task.title[i18n.language]}
            current={current}
            total={task.required}
            xp={task.xpReward}
          />
        );
      })}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={{ paddingTop: 50 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonResourceCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Screen padded={false}>
          <FlatList
            data={resources}
            renderItem={renderResource}
            keyExtractor={(r) => r.id}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContent}
          />
        </Screen>
      </SafeAreaView>

      {rewardEvent && (
        <RewardCelebration
          key={rewardEvent.message}
          message={rewardEvent.message}
          onDone={clearReward}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing(2.5),
  },
  header: { marginBottom: theme.spacing(2) },

  listContent: {
    paddingHorizontal: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    paddingBottom: theme.spacing(1.5),
  },
  viewAll: { color: theme.colors.primary, fontSize: 14, fontWeight: "600" },

  footer: { marginTop: theme.spacing(3) },
}));
