import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export const HAPTICS_KEY = "settings.haptics";

type Listener = (v: boolean) => void;
let hapticsEnabled = false;
const listeners = new Set<Listener>();

export async function initHapticsFromStorage() {
    try {
        const v = await AsyncStorage.getItem(HAPTICS_KEY);
        hapticsEnabled = v === "1" || v === "true";
        emit(hapticsEnabled);
    } catch { }
}

export function isHapticsEnabled() {
    return hapticsEnabled;
}

export async function setHapticsEnabled(v: boolean) {
    hapticsEnabled = v;
    await AsyncStorage.setItem(HAPTICS_KEY, v ? "1" : "0");
    emit(v);
}

export function subscribeHaptics(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

function emit(v: boolean) {
    listeners.forEach((fn) => { try { fn(v); } catch { } });
}

export function hapticSelection() {
    if (!hapticsEnabled || Platform.OS === "web") return;
    try { Haptics.selectionAsync(); } catch { }
}

export function hapticLight() {
    if (!hapticsEnabled || Platform.OS === "web") return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch { }
}

export function hapticSuccess() {
    if (!hapticsEnabled || Platform.OS === "web") return;
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch { }
}
