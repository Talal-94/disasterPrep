// store/useAuthStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoredUser {
    uid: string;
    email: string | null;
}

interface AuthState {
    user: StoredUser | null;
    setUser: (u: StoredUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (firebaseUser) =>
                set({
                    // map the full User → plain object
                    user: firebaseUser
                        ? { uid: firebaseUser.uid, email: firebaseUser.email }
                        : null,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
