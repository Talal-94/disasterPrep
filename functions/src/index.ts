/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// functions/src/index.ts
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import fetch from 'node-fetch';


import serviceAccount from '../service-account-key.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


const OPENWEATHER_KEY = '563929087b7193e4999b96d6eac65604';
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

type WeatherAlert = {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags?: string[];
};

type DeviceTokenEntry = {
    id: string;
    token: string;
    lat: number;
    lon: number;
};

// async function sendExpoPushNotification(token: string, title: string, body: string) {
//     await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Accept-Encoding': 'gzip, deflate',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             to: token,
//             sound: 'default',
//             title,
//             body,
//         }),
//     });
// }


async function getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
    const mockAlert = [
        {
            sender_name: 'Mock Authority',
            event: '🚨 Sandstorm 🚨',
            start: Date.now() / 1000,
            end: (Date.now() + 3600 * 2) / 1000,
            description: "Low visibility due to the sandstorm in the area.",
        },
    ]
    try {
        const response = await fetch(url);
        if (!response.ok) {
            logger.warn('Weather API call failed', response.status);
            return [];
        }

        const raw = await response.json();
        const data = raw as { alerts?: WeatherAlert[] };

        return data.alerts || mockAlert;
    } catch (error) {
        logger.error('Error fetching weather alerts', error);
        return [];
    }
}



export const notifyAlerts = onSchedule('every 24 hours', async () => {
    const snapshot = await admin.firestore().collection('device_tokens').get();

    const devices: DeviceTokenEntry[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            token: data.token, // This should be an Expo Push Token (e.g. starts with "ExponentPushToken[...]")
            lat: data.lat,
            lon: data.lon,
        };
    });

    for (const device of devices) {
        const alerts = await getWeatherAlerts(device.lat, device.lon);

        if (alerts.length > 0) {
            const firstAlert = alerts[0];

            // ✅ Send via Expo Push API 
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: device.token, // Expo Push Token
                    title: firstAlert.event,
                    body: firstAlert.description,
                }),
            });


            const result = await response.json();
            console.log('Expo push result:', result);

        }
    }
});