import { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { firestore } from "@/utils/firebasee";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "@react-native-firebase/firestore";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import ResourceCard from "@/components/learn/ResourceCard";

const PAGE_SIZE = 10;

export default function ResourcesHubScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [resources, setResources] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null>(
      null
    );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch first page
  const fetchFirst = useCallback(async () => {
    try {
      const firstQ = query(
        collection(firestore, "resources"),
        orderBy("title"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(firstQ);
      const docs = snap.docs.map((d: { id: any; data: () => any }) => ({
        id: d.id,
        ...d.data(),
      }));
      setResources(docs);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
    } catch (e) {
      console.error("Error loading resourcesHub:", e);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  // Fetch next page
  const fetchMore = useCallback(async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextQ = query(
        collection(firestore, "resources"),
        orderBy("title"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(nextQ);
      const more = snap.docs.map((d: { id: any; data: () => any }) => ({
        id: d.id,
        ...d.data(),
      }));
      setResources((prev) => [...prev, ...more]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
    } catch (e) {
      console.error("Error loading more resources:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [i18n.language, lastDoc, loadingMore]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [fetchFirst]);

  useEffect(() => {
    fetchFirst();
  }, [fetchFirst]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const localizedContent = item.content?.[i18n.language] ?? "";
      return (
        <ResourceCard
          icon={<Text>📘</Text>}
          title={item.title[i18n.language]}
          description={
            typeof localizedContent === "string"
              ? localizedContent.slice(0, 60) + "…"
              : ""
          }
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={{ paddingTop: 16 }}
      data={resources}
      renderItem={renderItem}
      keyExtractor={(r) => r.id}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
