// app/(tabs)/settings/SettingsScreen.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLanguage } from "../../../utils/locales/i18n";
import { auth } from "@/utils/firebasee";
import { signOut } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store/useAuthStore";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

const LANGUAGE_KEY = "user-language";
const THEME_KEY = "settings.theme";

export default function SettingsScreen() {
  const [dark, setDark] = useState(UnistylesRuntime.themeName === "dark");

  const { t, i18n } = useTranslation();
  const [isArabic, setIsArabic] = useState(i18n.language === "ar");
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.setUser);
  const isAdmin = true;
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((lang) => {
      setIsArabic(lang === "ar");
    });
  }, []);
  useEffect(() => {
    // hydrate from storage on first mount
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        UnistylesRuntime.setTheme(saved);
        setDark(saved === "dark");
      }
    })();
  }, []);

  const toggleLanguage = async () => {
    const newLang = isArabic ? "en" : "ar";
    await changeLanguage(newLang);
    setIsArabic(!isArabic);
  };

  const onToggleTheme = async (value: boolean) => {
    setDark(value);
    const next = value ? "dark" : "light";
    UnistylesRuntime.setTheme(next); // <- instant theme swap
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  const handleLogout = async () => {
    try {
      // modular signOut call
      await signOut(auth);
      clearUser(null);
      router.replace("/(auth)/login");
    } catch (err: any) {
      Alert.alert(t("auth.logoutFailed"), err.message);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t("settings.title") || "Settings"}</Text>

        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.label}>{t("settings.language")}</Text>
            <View style={styles.switchRow}>
              <Text style={styles.lang}>English</Text>
              <Switch value={isArabic} onValueChange={toggleLanguage} />
              <Text style={styles.lang}>عربي</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Dark mode</Text>
            <Switch value={dark} onValueChange={onToggleTheme} />
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity
            onPress={() => router.push("/(admin)/seed")}
            style={{ padding: 12, backgroundColor: "#007AFF", borderRadius: 8 }}
          >
            <Text style={{ color: "white" }}>Seed Firestore</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lang: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: theme.spacing(1),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}));
