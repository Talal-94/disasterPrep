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

export default function TabsLayout() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

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
          title: "home",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "alerts",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="alert-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "learn",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
