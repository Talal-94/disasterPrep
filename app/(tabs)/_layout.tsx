import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";
import ThemedIcon from "@/components/ui/ThemedIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  initHapticsFromStorage,
  subscribeHaptics,
  hapticSelection,
} from "@/utils/haptics";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      await initHapticsFromStorage();
      unsub = subscribeHaptics(() => {});
    })();
    return () => unsub();
  }, []);

  return (
    <Tabs
      screenListeners={{ tabPress: () => hapticSelection() }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          // height: 64,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("homescreen.title", "Home"),
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t("alerts.title", "Alerts"),
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="alert-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t("learn.title", "Learn"),
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title", "Settings"),
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
