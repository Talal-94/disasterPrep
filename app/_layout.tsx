import { initLocalization } from "../utils/locales/i18n";
import { useEffect, useState } from "react";
import { Slot, SplashScreen, useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import GlobalRewardCelebration from "@/components/animation/GlobalRewardCelebration";
import Toast from "react-native-toast-message";
import { auth } from "@/utils/firebasee";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initLocalization();
      await SplashScreen.hideAsync();
      setIsReady(true);
    };
    init();
  }, []);

  // 2. Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.replace("/(auth)/login");
      } else {
        setIsReady(true);
      }
    });
    return unsubscribe;
  }, [router, setUser]);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <Slot />
      <GlobalRewardCelebration />
      <Toast />
    </>
  );
}
