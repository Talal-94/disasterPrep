import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUnistyles } from "react-native-unistyles";

export default function TabsLayout() {
  const { theme } = useUnistyles(); // allowed here per docs

  return (
    <Tabs
      screenOptions={({ route }) => ({
        contentStyle: { backgroundColor: theme.colors.background },
        headerShown: false,
        tabBarIcon: ({ size, color }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            home: "home",
            alerts: "warning",
            learn: "school",
            settings: "settings",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="alerts" options={{ title: "Alert" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
