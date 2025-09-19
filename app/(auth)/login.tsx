import React from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";

import { auth } from "@/utils/firebasee";
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";

import Screen from "@/components/ui/Screen";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      const code = e?.code ?? "";
      const msg =
        code === "auth/invalid-credential" ||
        code === "auth/invalid-email" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
          ? t("auth.invalidCredentials", "Invalid email or password.")
          : e?.message || t("common.somethingWrong", "Something went wrong.");
      Toast.show({
        type: "error",
        text1: t("auth.signInFailed", "Sign in failed"),
        text2: msg,
      });
      console.warn("Login failed:", e);
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
            {t("auth.loginTitle", "Login")}
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
            returnKeyType="done"
            onSubmitEditing={onLogin}
          />

          <Button
            title={
              loading
                ? t("auth.signingIn", "Signing in…")
                : t("auth.signIn", "Sign In")
            }
            onPress={onLogin}
            disabled={!email || !password || loading}
            style={styles.cta}
            full
          />

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>
              {t("auth.noAccount", "Don't have an account? Register here")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text style={styles.link}>
              {t("auth.forgot", "Forgot password?")}
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
