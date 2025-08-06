// hooks/usePushNotifications.ts
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function usePushNotifications(
    onTokenReceived?: (token: string) => void
) {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    useEffect(() => {
        // Set foreground behavior
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });


        // Register and get token
        async function registerForPush() {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Push notification permission not granted.');
                return;
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            const token = tokenData.data;
            setExpoPushToken(token);
            console.log('✅ Expo Push Token:', token);
            onTokenReceived?.(token);
        }

        // Android channel
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'default',
            });
        }

        registerForPush();

        // Log notification received (foreground)
        const subReceived = Notifications.addNotificationReceivedListener(notification => {
            console.log('📩 Notification received:', notification);
        });

        // Log notification tapped (background)
        const subResponse = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('👆 Notification tapped:', response);
        });

        return () => {
            subReceived.remove();
            subResponse.remove();
        };
    }, []);

    return expoPushToken;
}
