
import * as Location from "expo-location";
import { registerForPushToken } from "./notifications";
import { firestore } from "./firebasee";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "@react-native-firebase/firestore";

export async function registerUserDevice() {
    try {
        const token = await registerForPushToken();
        if (!token) return;

        const { coords } = await Location.getCurrentPositionAsync({});
        const currentLat = coords.latitude;
        const currentLon = coords.longitude;

        const ref = doc(firestore, "device_tokens", token);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const data = snap.data() as { lat?: number; lon?: number };

            const latChanged = Math.abs((data.lat ?? 0) - currentLat) > 0.01;
            const lonChanged = Math.abs((data.lon ?? 0) - currentLon) > 0.01;

            if (!latChanged && !lonChanged) {
                console.log("✅ Token already registered, location unchanged. Skipping.");
                return;
            }

            console.log("📍 Location changed. Updating token.");
            await updateDoc(ref, {
                lat: currentLat,
                lon: currentLon,
                timestamp: Date.now(),
            });
            return;
        }

        console.log("🆕 New device token. Registering.");
        await setDoc(ref, {
            token,
            lat: currentLat,
            lon: currentLon,
            timestamp: Date.now(),
        });
    } catch (err) {
        console.warn("❌ Error registering device:", err);
    }
}
