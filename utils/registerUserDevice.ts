// import * as Location from "expo-location";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { firestore } from "./firebasee";
// import { registerForPushToken } from "./notifications";

// export async function registerUserDevice() {
//     try {
//         const token = await registerForPushToken();
//         if (!token) return;

//         const { coords } = await Location.getCurrentPositionAsync({});
//         const docRef = doc(firestore, "device_tokens", token);
//         const existingDoc = await getDoc(docRef);

//         const currentLat = coords.latitude;
//         const currentLon = coords.longitude;

//         if (existingDoc.exists()) {
//             const data = existingDoc.data();
//             const latChanged = Math.abs(data.lat - currentLat) > 0.01;
//             const lonChanged = Math.abs(data.lon - currentLon) > 0.01;

//             if (!latChanged && !lonChanged) {
//                 console.log("✅ Token already registered, location unchanged. Skipping.");
//                 return;
//             }

//             console.log("📍 Location changed. Updating token entry.");
//         } else {
//             console.log("🆕 New device token. Registering.");
//         }

//         await setDoc(docRef, {
//             token,
//             lat: currentLat,
//             lon: currentLon,
//             timestamp: Date.now(),
//         });

//         console.log("✅ Device registered/updated in Firestore.");

//     } catch (err) {
//         console.warn("❌ Error registering device:", err);
//     }
// }
import * as Location from "expo-location";
import { registerForPushToken } from "./notifications";
import { firestore } from "./firebasee";

export async function registerUserDevice() {
    try {
        const token = await registerForPushToken();
        if (!token) return;

        const { coords } = await Location.getCurrentPositionAsync({});
        const currentLat = coords.latitude;
        const currentLon = coords.longitude;

        const docRef = firestore.collection("device_tokens").doc(token);
        const docSnap = await docRef.get();

        // 1) Call exists() as a method, not a property
        if (docSnap.exists()) {
            // 2) Narrow data() with a non-null assertion (we know it exists)
            const data = docSnap.data()!;
            const latChanged = Math.abs(data.lat - currentLat) > 0.01;
            const lonChanged = Math.abs(data.lon - currentLon) > 0.01;

            if (!latChanged && !lonChanged) {
                console.log("✅ Token already registered, location unchanged. Skipping.");
                return;
            }
            console.log("📍 Location changed. Updating token entry.");
        } else {
            console.log("🆕 New device token. Registering.");
        }

        // Write or overwrite the document
        await docRef.set({
            token,
            lat: currentLat,
            lon: currentLon,
            timestamp: Date.now(),
        });
        console.log("✅ Device registered/updated in Firestore.");
    } catch (err) {
        console.warn("❌ Error registering device:", err);
    }
}
