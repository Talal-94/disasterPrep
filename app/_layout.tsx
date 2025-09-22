import * as SplashScreen from "expo-splash-screen";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { auth } from "@/utils/firebasee";
import { useAuthStore } from "@/store/useAuthStore";
import { initLocalization } from "@/utils/locales/i18n";
import { View, StatusBar } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../unistyles";
import GlobalRewardCelebration from "@/components/animation/GlobalRewardCelebration";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initLocalization();

        const saved = await AsyncStorage.getItem("settings.theme");
        if (saved === "dark" || saved === "light") {
          UnistylesRuntime.setTheme(saved);
          const palette = saved === "dark" ? darkTheme : lightTheme;
          UnistylesRuntime.setRootViewBackgroundColor(
            palette.colors.background
          );
          StatusBar.setBarStyle(palette.barStyle);
        }
      } catch {
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch {}
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) router.replace("/login");
    });
    return unsub;
  }, [isReady, router, setUser]);

  if (!isReady) return null;

  return (
    <View style={styles.root}>
      <Slot />
      <GlobalRewardCelebration />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background },
}));
