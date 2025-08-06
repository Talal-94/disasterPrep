// app/index.tsx
import { Redirect } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  // If logged in, go into the tabs/home stack; otherwise go to auth/login
  return <Redirect href={user ? "(tabs)/home" : "(auth)/login"} />;
}
