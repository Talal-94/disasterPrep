import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import { useEffect } from "react";
import "./utils/locales/i18n";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📩 Notification received (foreground):", notification);
      }
    );

    const subResp = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("🔘 Notification tapped (background/closed):", response);
      }
    );

    return () => {
      sub.remove();
      subResp.remove();
    };
  }, []);

  return <Slot />;
}
