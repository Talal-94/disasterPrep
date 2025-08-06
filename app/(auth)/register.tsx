import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { auth, firestore } from "@/utils/firebasee";
import { createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import { useXPStore } from "@/store/xpStore";

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetXP = useXPStore.getState().reset;

  const handleRegister = async () => {
    try {
      // 1) modular auth helper
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = user.uid;

      // 2) modular Firestore calls
      const userRef = doc(firestore, "users", uid);
      await setDoc(
        userRef,
        {
          xp: 0,
          completedResources: [],
          completedQuizzes: [],
          badges: [],
          completedTasks: [],
        },
        { merge: true }
      );

      // 3) reset local store & navigate
      resetXP();
      router.replace("/");
    } catch (err: any) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t("auth.register")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("auth.email")}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t("auth.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t("auth.signUp")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={styles.link}>{t("auth.alreadyHaveAccount")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
