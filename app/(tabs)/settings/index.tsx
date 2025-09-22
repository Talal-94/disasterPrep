import React, { useEffect, useState } from "react";
import { View, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { signOut } from "@react-native-firebase/auth";
import { auth } from "@/utils/firebasee";
import i18n, { changeLanguage } from "@/utils/locales/i18n";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import * as Haptics from "expo-haptics";
import {
  initHapticsFromStorage,
  isHapticsEnabled,
  setHapticsEnabled,
} from "@/utils/haptics";

const THEME_KEY = "settings.theme";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const isAdmin = true;
  const [dark, setDark] = useState(UnistylesRuntime.themeName === "dark");
  const [haptics, setHaptics] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">(
    i18n?.language === "ar" ? "ar" : "en"
  );

  useEffect(() => {
    (async () => {
      await initHapticsFromStorage();
      setHaptics(isHapticsEnabled());
    })();
  }, []);

  React.useEffect(() => {
    const onChange = (lng: string) => setLang(lng === "ar" ? "ar" : "en");
    i18n.on("languageChanged", onChange);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        UnistylesRuntime.setTheme(savedTheme);
        setDark(savedTheme === "dark");
        const active = UnistylesRuntime.getTheme();
        UnistylesRuntime.setRootViewBackgroundColor(active.colors.background);
        StatusBar.setBarStyle(active.barStyle);
      }
    })();
  }, []);

  const onToggleTheme = async (value: boolean) => {
    setDark(value);
    UnistylesRuntime.setTheme(value ? "dark" : "light");
    const active = UnistylesRuntime.getTheme();
    UnistylesRuntime.setRootViewBackgroundColor(active.colors.background);
    StatusBar.setBarStyle(active.barStyle);
    await AsyncStorage.setItem(THEME_KEY, value ? "dark" : "light");
  };

  const onChangeLang = async (next: "en" | "ar") => {
    setLang(next);
    try {
      await changeLanguage(next);
    } catch {}
  };

  const onToggleHaptics = async (value: boolean) => {
    setHaptics(value);
    await setHapticsEnabled(value);
    if (value) Haptics.selectionAsync();
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout failed:", e);
    }
  };
  const goToAdmin = async () => {
    router.navigate("/(admin)/seed");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Screen padded>
        <Text variant="title" style={styles.header}>
          {t("settings.title", "Settings")}
        </Text>

        <Card style={styles.card}>
          <Text variant="subtitle">
            {t("settings.appearance", "Appearance")}
          </Text>
          <View style={styles.rowTight}>
            <Text>{t("settings.darkMode", "Dark mode")}</Text>
            <Switch value={dark} onValueChange={onToggleTheme} />
          </View>

          <View style={styles.rowTight}>
            <Text>{t("settings.haptics", "Haptic feedback")}</Text>
            <Switch value={haptics} onValueChange={onToggleHaptics} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="subtitle">{t("settings.language", "Language")}</Text>
          <Divider />
          <View style={styles.langRow}>
            <Button
              title={t("settings.english", "English")}
              variant={lang === "en" ? "primary" : "ghost"}
              onPress={() => onChangeLang("en")}
              style={styles.halfBtn}
            />
            <View style={styles.spacer} />
            <Button
              title={t("settings.arabic", "العربية")}
              variant={lang === "ar" ? "primary" : "ghost"}
              onPress={() => onChangeLang("ar")}
              style={styles.halfBtn}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="subtitle">{t("settings.account", "Account")}</Text>
          <Divider />
          <Button
            title={t("settings.logout", "Log out")}
            variant="danger"
            onPress={onLogout}
          />
        </Card>
        {isAdmin && (
          <Card style={styles.card}>
            <Text variant="subtitle">
              {t("settings.adminPanel", "Admin Panel")}
            </Text>
            <Divider />
            <Button
              title={t("settings.adminPanel", "Admin Panel")}
              variant="primary"
              onPress={goToAdmin}
            />
          </Card>
        )}
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  header: { marginBottom: theme.spacing(2) },

  card: {
    marginBottom: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.5),
  },

  rowTight: {
    marginTop: theme.spacing(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  langRow: {
    marginTop: theme.spacing(1),
    flexDirection: "row",
    alignItems: "center",
  },

  spacer: { width: theme.spacing(1) },

  halfBtn: { flex: 1 },
}));
