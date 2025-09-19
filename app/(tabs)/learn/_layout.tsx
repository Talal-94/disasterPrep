// app/(tabs)/learn/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

export default function LearnLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTitleStyle: { color: theme.colors.text, fontWeight: "700" },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="resourcesHub/index"
        options={{ title: "Resources" }}
      />

      <Stack.Screen
        name="resourcesHub/ResourceDetailScreen"
        options={{ title: "Guide" }}
      />

      <Stack.Screen name="quizzes/index" options={{ title: "Quizzes" }} />
      <Stack.Screen name="quizzes/[id]" options={{ title: "Quiz" }} />
    </Stack>
  );
}
