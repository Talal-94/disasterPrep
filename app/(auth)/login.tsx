import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { auth, firestore } from "@/utils/firebasee";
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { doc, getDoc, setDoc } from "@react-native-firebase/firestore";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 1) use modular helper
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const uid = user.uid;

      // 2) modular Firestore calls
      const userRef = doc(firestore, "users", uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          xp: 0,
          completedResources: [],
          completedQuizzes: [],
          badges: [],
        });
      }

      // 3) navigate
      router.replace("/");
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t("auth.login")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("auth.email")}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder={t("auth.password")}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("auth.signIn")}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
        <Text style={styles.link}>{t("auth.noAccount")}</Text>
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
