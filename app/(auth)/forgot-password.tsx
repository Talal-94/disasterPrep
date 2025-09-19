import React from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";

import { auth } from "@/utils/firebasee";
import { sendPasswordResetEmail } from "@react-native-firebase/auth";

import Screen from "@/components/ui/Screen";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onReset = async () => {
    if (!email || loading) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Toast.show({
        type: "success",
        text1: t("auth.resetSentTitle", "Check your inbox"),
        text2: t("auth.resetSentBody", "We sent a password reset link."),
      });
      router.replace("/login");
    } catch (e: any) {
      const code = e?.code ?? "";
      const msg =
        code === "auth/invalid-email"
          ? t("auth.invalidEmail", "Invalid email address.")
          : code === "auth/user-not-found"
          ? t("auth.userNotFound", "No user found with that email.")
          : e?.message || t("common.somethingWrong", "Something went wrong.");
      Toast.show({
        type: "error",
        text1: t("auth.resetFailed", "Reset failed"),
        text2: msg,
      });
      console.warn("Password reset failed:", e);
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
            {t("auth.resetTitle", "Forgot password")}
          </Text>

          <Text style={styles.helper}>
            {t(
              "auth.resetExplain",
              "Enter the email you used to sign up and we’ll send you a reset link."
            )}
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
            returnKeyType="done"
            onSubmitEditing={onReset}
          />

          <Button
            title={
              loading
                ? t("auth.sending", "Sending…")
                : t("auth.sendReset", "Send reset link")
            }
            onPress={onReset}
            disabled={!email || loading}
            style={styles.cta}
            full
          />

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.link}>
              {t("auth.backToLogin", "Back to login")}
            </Text>
          </TouchableOpacity>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  title: { marginTop: theme.spacing(2), marginBottom: theme.spacing(1) },
  helper: { color: theme.colors.muted, marginBottom: theme.spacing(1.5) },
  field: { marginTop: theme.spacing(1) },
  cta: { marginTop: theme.spacing(2) },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));
