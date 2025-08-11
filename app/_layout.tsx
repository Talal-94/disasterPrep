import * as SplashScreen from "expo-splash-screen";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import { initLocalization } from "../utils/locales/i18n";
import { auth } from "@/utils/firebasee";
import GlobalRewardCelebration from "@/components/animation/GlobalRewardCelebration";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 1) Do all boot work, and ALWAYS set ready in finally
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initLocalization();
      } catch (e) {
        console.warn("initLocalization failed:", e);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn("SplashScreen.hideAsync failed:", e);
        }
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Subscribe to auth AFTER ready
  useEffect(() => {
    if (!isReady) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.replace("/login"); // no group in URL path
      }
    });
    return unsub;
  }, [isReady, router, setUser]);

  if (!isReady) return null;

  return (
    <>
      <Slot />
      <GlobalRewardCelebration />
      <Toast />
    </>
  );
}
