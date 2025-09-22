import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

export default function LearnLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTitleStyle: { color: theme.colors.text, fontWeight: "700" },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: t("learn.title", "Learn") }}
      />

      <Stack.Screen
        name="resourcesHub/index"
        options={{ title: "Resources" }}
      />

      <Stack.Screen
        name="resourcesHub/ResourceDetailScreen"
        options={{ title: t("learn.guide") }}
      />

      <Stack.Screen
        name="quizzes/index"
        options={{ title: t("learn.quizzes", "Quizzes") }}
      />
      <Stack.Screen
        name="quizzes/[id]"
        options={{ title: t("learn.quiz", "Quiz") }}
      />
    </Stack>
  );
}
