// app/(auth)/register.tsx
import React from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";

import { auth } from "@/utils/firebasee";
import { createUserWithEmailAndPassword } from "@react-native-firebase/auth";

import Screen from "@/components/ui/Screen";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onRegister = async () => {
    if (!email || !password || !confirm || loading) return;
    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: t("auth.passwordsDontMatch", "Passwords don’t match"),
      });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      const code = e?.code ?? "";
      const msg =
        code === "auth/email-already-in-use"
          ? t("auth.emailInUse", "Email already in use.")
          : code === "auth/invalid-email"
          ? t("auth.invalidEmail", "Invalid email address.")
          : code === "auth/weak-password"
          ? t("auth.weakPassword", "Password is too weak.")
          : e?.message || t("common.somethingWrong", "Something went wrong.");
      Toast.show({
        type: "error",
        text1: t("auth.signUpFailed", "Sign up failed"),
        text2: msg,
      });
      console.warn("Register failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding" })}
        style={{ flex: 1 }}
      >
        <Screen>
          <Text variant="title" style={styles.title}>
            {t("auth.registerTitle", "Create account")}
          </Text>

          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholder={t("auth.email", "Email Address")}
            containerStyle={styles.field}
            returnKeyType="next"
          />

          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t("auth.password", "Password")}
            containerStyle={styles.field}
            returnKeyType="next"
          />

          <Input
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t("auth.confirmPassword", "Confirm Password")}
            containerStyle={styles.field}
            returnKeyType="done"
            onSubmitEditing={onRegister}
          />

          <Button
            title={
              loading
                ? t("auth.creatingAccount", "Creating account…")
                : t("auth.signUp", "Sign Up")
            }
            onPress={onRegister}
            disabled={!email || !password || !confirm || loading}
            style={styles.cta}
            full
          />

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.link}>
              {t("auth.haveAccount", "Already have an account? Sign in")}
            </Text>
          </TouchableOpacity>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  title: { marginTop: theme.spacing(2), marginBottom: theme.spacing(1.5) },
  field: { marginTop: theme.spacing(1) },
  cta: { marginTop: theme.spacing(2) },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));
