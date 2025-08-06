import { Stack } from "expo-router";

export default function LearnStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ title: "Learn", headerShown: false }}
      />
      <Stack.Screen
        name="resourcesHub/ResourceDetailScreen"
        options={{ title: "Article" }}
      />
      <Stack.Screen name="resourcesHub/index" options={{ title: "The hub" }} />
    </Stack>
  );
}
