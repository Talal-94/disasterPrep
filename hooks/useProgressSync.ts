// hooks/useProgressSync.ts

import { useState, useEffect } from "react";
import { auth, firestore } from "@/utils/firebasee";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    onSnapshot,
    writeBatch,
    updateDoc,
    arrayUnion,
    increment,
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import i18n from "@/utils/locales/i18n";
import { useXPStore } from "@/store/xpStore";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Types 

type TaskDoc = {
    type: "resourceRead" | "quizComplete" | "streak";
    required: number;
    xpReward: number;
};
type TaskDef = TaskDoc & { id: string };

type BadgeDoc = {
    condition: {
        type: "resourceRead" | "quizComplete" | "streak";
        value: number;
    };
    xpReward: number;
};
type BadgeDef = BadgeDoc & { id: string };

// ─── Utility 

function hasCompleted(id: string, list: string[] = []) {
    return list.includes(id);
}
function isToday(date: Date) {
    const today = new Date();
    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
}

// ─── Hook 

export default function useProgressSync() {
    const { user } = useAuthStore();
    const {
        setXP,
        setCompletedResources,
        setCompletedQuizzes,
        setCompletedTasks,
        setBadges,
        addXP,
        addCompletedTask,
        addBadge,
        triggerReward,
    } = useXPStore();

    const [taskDefs, setTaskDefs] = useState<TaskDef[]>([]);
    const [badgeDefs, setBadgeDefs] = useState<BadgeDef[]>([]);
    const [isFirstSnap, setIsFirstSnap] = useState(true);

    // 1) Load task + badge definitions once
    useEffect(() => {
        (async () => {
            const tSnap = await getDocs(collection(firestore, "tasks"));
            setTaskDefs(
                tSnap.docs.map(
                    (d: FirebaseFirestoreTypes.QueryDocumentSnapshot<TaskDoc>) => ({
                        id: d.id,
                        ...(d.data() as TaskDoc),
                    })
                )
            );

            const bSnap = await getDocs(collection(firestore, "badges"));
            setBadgeDefs(
                bSnap.docs.map(
                    (d: FirebaseFirestoreTypes.QueryDocumentSnapshot<BadgeDoc>) => ({
                        id: d.id,
                        ...(d.data() as BadgeDoc),
                    })
                )
            );
        })();
    }, []);

    // 2) Sync user doc & award logic
    useEffect(() => {
        if (!user?.uid) return;
        const userRef = doc(firestore, "users", user.uid);

        const unsub = onSnapshot(userRef, async (snap) => {
            const data = snap.data() || {};

            // hydrate store
            setXP(data.xp ?? 0);
            setCompletedResources(data.completedResources ?? []);
            setCompletedQuizzes(data.completedQuizzes ?? []);
            setCompletedTasks(data.completedTasks ?? []);
            setBadges(data.badges ?? []);

            // skip awards on first snapshot
            if (isFirstSnap) {
                setIsFirstSnap(false);
                return;
            }

            const batch = writeBatch(firestore);
            let dirty = false;

            // Award tasks
            for (const task of taskDefs) {
                if (hasCompleted(task.id, data.completedTasks)) continue;
                const progress =
                    task.type === "resourceRead"
                        ? (data.completedResources || []).length
                        : (data.completedQuizzes || []).length;
                if (progress >= task.required) {
                    dirty = true;
                    addXP(task.xpReward);
                    addCompletedTask(task.id);
                    triggerReward({
                        type: "task",
                        message: i18n.t("learn.rewards.taskComplete", {
                            xp: task.xpReward,
                        }),
                    });
                    batch.update(userRef, {
                        xp: increment(task.xpReward),
                        completedTasks: arrayUnion(task.id),
                    });
                }
            }

            // Award badges
            for (const badge of badgeDefs) {
                if (hasCompleted(badge.id, data.badges)) continue;
                const { type, value } = badge.condition;
                const progress =
                    type === "resourceRead"
                        ? (data.completedResources || []).length
                        : (data.completedQuizzes || []).length;
                if (progress >= value) {
                    dirty = true;
                    addXP(badge.xpReward);
                    addBadge(badge.id);
                    triggerReward({
                        type: "badge",
                        message: i18n.t("learn.rewards.badgeUnlocked", {
                            xp: badge.xpReward,
                        }),
                    });
                    batch.update(userRef, {
                        xp: increment(badge.xpReward),
                        badges: arrayUnion(badge.id),
                    });
                }
            }

            if (dirty) {
                try {
                    await batch.commit();
                } catch (err) {
                    console.error("🔥 Award commit failed:", err);
                }
            }
        });

        return () => unsub();
    }, [user?.uid, taskDefs, badgeDefs]);

    // 3) Mark resource as read
    async function markResourceAsRead(resourceId: string, xpReward: number) {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userRef = doc(firestore, "users", currentUser.uid);

        const update: any = {
            completedResources: arrayUnion(resourceId),
            xp: increment(xpReward),
            "missions.daily.readGuide": true,
            updatedAt: new Date(),
        };

        // streak logic
        const snap = await getDoc(userRef);
        const raw = snap.data()?.lastLogin;
        const lastLogin =
            raw instanceof Date ? raw : (raw as any)?.toDate?.();
        update.streak = !lastLogin || !isToday(lastLogin) ? 1 : increment(1);
        update.lastLogin = new Date();

        try {
            await updateDoc(userRef, update);
            Toast.show({
                type: "success",
                text1: "Resource marked as read!",
                text2: `+${xpReward} XP awarded`,
            });
        } catch (err) {
            console.error("Failed to mark resource complete:", err);
        }
    }

    // 4) Mark quiz as complete
    async function markQuizAsComplete(quizId: string, xpReward: number) {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userRef = doc(firestore, "users", currentUser.uid);

        try {
            await updateDoc(userRef, {
                completedQuizzes: arrayUnion(quizId),
                xp: increment(xpReward),
                "missions.daily.completeQuiz": true,
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error("Failed to mark quiz complete:", err);
        }
    }

    return { markResourceAsRead, markQuizAsComplete };
}
