// // hooks/useProgressSync.ts
// import { useState, useEffect } from "react";
// import { auth, firestore } from "@/utils/firebasee";
// import {
//     collection,
//     getDocs,
//     doc,
//     getDoc,
//     onSnapshot,
//     writeBatch,
//     arrayUnion,
//     increment,
//     setDoc,
//     FirebaseFirestoreTypes,
//     runTransaction,
// } from "@react-native-firebase/firestore";
// import Toast from "react-native-toast-message";
// import i18n from "@/utils/locales/i18n";
// import { useXPStore } from "@/store/xpStore";
// import { useAuthStore } from "@/store/useAuthStore";

// // ─── Types
// type TaskDoc = {
//     type: "resourceRead" | "quizComplete" | "streak";
//     required: number;
//     xpReward: number;
// };
// type TaskDef = TaskDoc & { id: string };

// type BadgeDoc = {
//     condition: {
//         type: "resourceRead" | "quizComplete" | "streak";
//         value: number;
//     };
//     xpReward: number;
// };
// type BadgeDef = BadgeDoc & { id: string };

// // ─── Utility
// function hasCompleted(id: string, list: string[] = []) {
//     return list.includes(id);
// }
// function isToday(date: Date) {
//     const today = new Date();
//     return (
//         today.getFullYear() === date.getFullYear() &&
//         today.getMonth() === date.getMonth() &&
//         today.getDate() === date.getDate()
//     );
// }

// // ─── Hook
// export default function useProgressSync() {
//     const { user } = useAuthStore();
//     const {
//         setXP,
//         setCompletedResources,
//         setCompletedQuizzes,
//         setCompletedTasks,
//         setBadges,
//         addXP,
//         addCompletedTask,
//         addBadge,
//         triggerReward,
//     } = useXPStore();

//     const [taskDefs, setTaskDefs] = useState<TaskDef[]>([]);
//     const [badgeDefs, setBadgeDefs] = useState<BadgeDef[]>([]);
//     const [isFirstSnap, setIsFirstSnap] = useState(true);

//     // 1) Load task + badge definitions once
//     useEffect(() => {
//         (async () => {
//             const tSnap = await getDocs(collection(firestore, "tasks"));
//             setTaskDefs(
//                 tSnap.docs.map(
//                     (d: FirebaseFirestoreTypes.QueryDocumentSnapshot<TaskDoc>) => ({
//                         id: d.id,
//                         ...(d.data() as TaskDoc),
//                     })
//                 )
//             );

//             const bSnap = await getDocs(collection(firestore, "badges"));
//             setBadgeDefs(
//                 bSnap.docs.map(
//                     (d: FirebaseFirestoreTypes.QueryDocumentSnapshot<BadgeDoc>) => ({
//                         id: d.id,
//                         ...(d.data() as BadgeDoc),
//                     })
//                 )
//             );
//         })();
//     }, []);

//     // 2) Sync user doc & award logic
//     useEffect(() => {
//         if (!user?.uid) return;
//         const userRef = doc(firestore, "users", user.uid);

//         const unsub = onSnapshot(userRef, async (snap) => {
//             const data = snap.data() || {};

//             // hydrate store (single set calls from your store)
//             setXP(data.xp ?? 0);
//             setCompletedResources(data.completedResources ?? []);
//             setCompletedQuizzes(data.completedQuizzes ?? []);
//             setCompletedTasks(data.completedTasks ?? []);
//             setBadges(data.badges ?? []);

//             // skip awards on first snapshot to avoid double-granting
//             if (isFirstSnap) {
//                 setIsFirstSnap(false);
//                 return;
//             }

//             const batch = writeBatch(firestore);
//             let dirty = false;

//             // buffer client-side updates (so we can defer them)
//             let xpDelta = 0;
//             const tasksEarned: string[] = [];
//             const badgesEarned: string[] = [];
//             const rewardMsgs: Array<{ type: "task" | "badge"; text: string }> = [];

//             // Award tasks
//             for (const task of taskDefs) {
//                 if (hasCompleted(task.id, data.completedTasks)) continue;
//                 const progress =
//                     task.type === "resourceRead"
//                         ? (data.completedResources || []).length
//                         : (data.completedQuizzes || []).length;

//                 if (progress >= task.required) {
//                     dirty = true;
//                     xpDelta += task.xpReward;
//                     tasksEarned.push(task.id);
//                     rewardMsgs.push({
//                         type: "task",
//                         text: i18n.t("learn.rewards.taskComplete", { xp: task.xpReward }),
//                     });

//                     // server write (merge to create doc if missing)
//                     batch.set(
//                         userRef,
//                         {
//                             xp: increment(task.xpReward),
//                             completedTasks: arrayUnion(task.id),
//                         },
//                         { merge: true }
//                     );
//                 }
//             }

//             // Award badges
//             for (const badge of badgeDefs) {
//                 if (hasCompleted(badge.id, data.badges)) continue;
//                 const { type, value } = badge.condition;
//                 const progress =
//                     type === "resourceRead"
//                         ? (data.completedResources || []).length
//                         : (data.completedQuizzes || []).length;
//                 if (progress >= value) {
//                     dirty = true;
//                     xpDelta += badge.xpReward;
//                     badgesEarned.push(badge.id);
//                     rewardMsgs.push({
//                         type: "badge",
//                         text: i18n.t("learn.rewards.badgeUnlocked", { xp: badge.xpReward }),
//                     });

//                     batch.set(
//                         userRef,
//                         {
//                             xp: increment(badge.xpReward),
//                             badges: arrayUnion(badge.id),
//                         },
//                         { merge: true }
//                     );
//                 }
//             }

//             if (dirty) {
//                 try {
//                     await batch.commit();
//                     setTimeout(() => {
//                         if (xpDelta) addXP(xpDelta);
//                         for (const t of tasksEarned) addCompletedTask(t);
//                         for (const b of badgesEarned) addBadge(b);
//                         for (const r of rewardMsgs) triggerReward({ type: r.type, message: r.text });
//                     }, 0);
//                 } catch (err) {
//                     console.error("🔥 Award commit failed:", err);
//                 }
//             }
//         });

//         return () => unsub();
//     }, [user?.uid, taskDefs, badgeDefs]);

//     async function markResourceAsRead(resourceId: string, xpReward: number) {
//         const currentUser = auth.currentUser;
//         if (!currentUser) return;
//         const userRef = doc(firestore, "users", currentUser.uid);

//         const update: any = {
//             completedResources: arrayUnion(resourceId),
//             xp: increment(xpReward),
//             "missions.daily.readGuide": true,
//             updatedAt: new Date(),
//         };

//         // streak logic
//         const snap = await getDoc(userRef);
//         const raw = snap.data()?.lastLogin;
//         const lastLogin = raw instanceof Date ? raw : (raw as any)?.toDate?.();
//         update.streak = !lastLogin || !isToday(lastLogin) ? 1 : increment(1);
//         update.lastLogin = new Date();

//         try {
//             await setDoc(userRef, update, { merge: true });
//             Toast.show({
//                 type: "success",
//                 text1: "Resource marked as read!",
//                 text2: `+${xpReward} XP awarded`,
//             });
//         } catch (err) {
//             console.error("Failed to mark resource complete:", err);
//         }
//     }

//     async function markQuizAsComplete(quizId: string, xpReward: number) {
//         const currentUser = auth.currentUser;
//         if (!currentUser) return { awarded: false, reason: "not-authenticated" };

//         const userRef = doc(firestore, "users", currentUser.uid);

//         try {
//             const result = await runTransaction(firestore, async (tx) => {
//                 const snap = await tx.get(userRef);
//                 const data = (snap.data() as any) || {};
//                 const already = Array.isArray(data.completedQuizzes)
//                     ? data.completedQuizzes.includes(quizId)
//                     : false;

//                 if (already) {
//                     // Nothing to do; do NOT increment XP again
//                     return { awarded: false, reason: "already-completed" };
//                 }

//                 tx.update(userRef, {
//                     completedQuizzes: arrayUnion(quizId),
//                     xp: increment(Number(xpReward) || 0),
//                     "missions.daily.completeQuiz": true,
//                     updatedAt: new Date(),
//                 });

//                 return { awarded: true, reason: "ok" };
//             });

//             return result;
//         } catch (err) {
//             console.error("Failed to mark quiz complete (tx):", err);
//             return { awarded: false, reason: "tx-error" };
//         }
//     }



//     return { markResourceAsRead, markQuizAsComplete };
// }













// hooks/useProgressSync.ts (Refactored)
// Goals:
// - Idempotent content XP (transactions for resource/quiz completion)
// - Correct streak math (max once/day, gap resets)
// - Snapshot awards start AFTER defs load, with re-entrancy guard
// - Deterministic milestone grants: pick highest milestone per kind (configurable)
// - Optional catch-up awards toggle (grant only highest vs all)
// - Small debug hooks to trace award decisions

import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "@/utils/firebasee";
import {
    collection,
    getDocs,
    doc,
    // getDoc,
    onSnapshot,
    // writeBatch,
    arrayUnion,
    increment,
    // setDoc,
    runTransaction,
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import i18n from "@/utils/locales/i18n";
import { useXPStore } from "@/store/xpStore";
import { useAuthStore } from "@/store/useAuthStore";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export type TaskDoc = {
    type: Kind; // "resourceRead" | "quizComplete" | "streak"
    required: number; // threshold
    xpReward: number;
};
export type TaskDef = TaskDoc & { id: string };

export type BadgeDoc = {
    condition: { type: Kind; value: number };
    xpReward: number;
};
export type BadgeDef = BadgeDoc & { id: string };

export type Kind = "resourceRead" | "quizComplete" | "streak";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// If true → grant ALL unearned milestones <= progress. If false → only the HIGHEST per kind.
const ALLOW_CATCHUP = false;

// Toggle verbose console debugging of award plans.
const DEBUG_AWARDS = false;

// ──────────────────────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────────────────────
const startOfDayUTC = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

function daysBetweenUTC(a: Date, b: Date) {
    const da = startOfDayUTC(a).getTime();
    const db = startOfDayUTC(b).getTime();
    return Math.round((da - db) / 86400000);
}

function progressOf(data: any, kind: Kind) {
    if (kind === "resourceRead") return (data.completedResources || []).length;
    if (kind === "quizComplete") return (data.completedQuizzes || []).length;
    if (kind === "streak") return Number(data.streak || 0);
    return 0;
}

function hasCompleted(id: string, list: string[] = []) {
    return list.includes(id);
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────────────────────────
export default function useProgressSync() {
    const { user } = useAuthStore();
    const {
        setXP,
        setCompletedResources,
        setCompletedQuizzes,
        setCompletedTasks,
        setBadges,
        // addXP,
        // addCompletedTask,
        // addBadge,
        triggerReward,
    } = useXPStore();

    const [taskDefs, setTaskDefs] = useState<TaskDef[]>([]);
    const [badgeDefs, setBadgeDefs] = useState<BadgeDef[]>([]);

    const defsReady = taskDefs.length > 0 || badgeDefs.length > 0; // allow either or both
    const awardingRef = useRef(false); // re-entrancy guard for snapshot award cycle
    const firstSnapRef = useRef(true); // skip hydrate-only first snapshot

    // Load task + badge definitions once
    useEffect(() => {
        let mounted = true;
        (async () => {
            const [tSnap, bSnap] = await Promise.all([
                getDocs(collection(firestore, "tasks")),
                getDocs(collection(firestore, "badges")),
            ]);

            if (!mounted) return;

            setTaskDefs(
                tSnap.docs.map((d: FirebaseFirestoreTypes.QueryDocumentSnapshot<TaskDoc>) => ({
                    id: d.id,
                    ...(d.data() as TaskDoc),
                }))
            );

            setBadgeDefs(
                bSnap.docs.map((d: FirebaseFirestoreTypes.QueryDocumentSnapshot<BadgeDoc>) => ({
                    id: d.id,
                    ...(d.data() as BadgeDoc),
                }))
            );
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Snapshot: hydrate + award engine (only after defs are available)
    useEffect(() => {
        if (!user?.uid) return;
        if (!defsReady) return; // wait until defs loaded to avoid catch-up bursts

        const userRef = doc(firestore, "users", user.uid);
        const unsub = onSnapshot(userRef, async (snap) => {
            const data = snap.data() || {};

            // Hydrate store from server truth
            setXP(data.xp ?? 0);
            setCompletedResources(data.completedResources ?? []);
            setCompletedQuizzes(data.completedQuizzes ?? []);
            setCompletedTasks(data.completedTasks ?? []);
            setBadges(data.badges ?? []);

            // Skip first snapshot to avoid immediate re-granting
            if (firstSnapRef.current) {
                firstSnapRef.current = false;
                return;
            }

            if (awardingRef.current) return; // prevent re-entrancy while committing

            const current: Record<Kind, number> = {
                resourceRead: progressOf(data, "resourceRead"),
                quizComplete: progressOf(data, "quizComplete"),
                streak: progressOf(data, "streak"),
            };

            // Build candidate lists
            const taskCandidates = taskDefs.filter(
                (t) => !hasCompleted(t.id, data.completedTasks) && current[t.type] >= t.required
            );
            const badgeCandidates = badgeDefs.filter(
                (b) => !hasCompleted(b.id, data.badges) && current[b.condition.type] >= b.condition.value
            );

            // Choose winners
            type TaskPick = TaskDef & { kind: Kind; threshold: number };
            type BadgePick = BadgeDef & { kind: Kind; threshold: number };

            const tasks: TaskPick[] = taskCandidates.map((t) => ({ ...t, kind: t.type, threshold: t.required }));
            const badges: BadgePick[] = badgeCandidates.map((b) => ({
                ...b,
                kind: b.condition.type,
                threshold: b.condition.value,
            }));

            const winnersTasks = pickMilestones(tasks, current, ALLOW_CATCHUP);
            const winnersBadges = pickMilestones(badges, current, ALLOW_CATCHUP);

            let xpDelta = 0;
            const earnedTaskIds: string[] = [];
            const earnedBadgeIds: string[] = [];
            const msgs: Array<{ type: "task" | "badge"; text: string }> = [];

            for (const t of winnersTasks) {
                xpDelta += Number(t.xpReward) || 0;
                earnedTaskIds.push(t.id);
                msgs.push({ type: "task", text: i18n.t("learn.rewards.taskComplete", { xp: t.xpReward }) });
            }
            for (const b of winnersBadges) {
                xpDelta += Number(b.xpReward) || 0;
                earnedBadgeIds.push(b.id);
                msgs.push({ type: "badge", text: i18n.t("learn.rewards.badgeUnlocked", { xp: b.xpReward }) });
            }

            if (DEBUG_AWARDS && (xpDelta || earnedTaskIds.length || earnedBadgeIds.length)) {
                console.log("Award plan", {
                    current,
                    winnersTasks: winnersTasks.map((t) => ({ id: t.id, thr: t.threshold, xp: t.xpReward, kind: t.kind })),
                    winnersBadges: winnersBadges.map((b) => ({ id: b.id, thr: b.threshold, xp: b.xpReward, kind: b.kind })),
                    xpDelta,
                });
            }

            if (!xpDelta && !earnedTaskIds.length && !earnedBadgeIds.length) return;

            awardingRef.current = true;
            try {
                await runTransaction(firestore, async (tx) => {
                    const curSnap = await tx.get(userRef);
                    const curData = (curSnap.data() as any) || {};

                    const curTasks: string[] = Array.isArray(curData.completedTasks) ? curData.completedTasks : [];
                    const curBadges: string[] = Array.isArray(curData.badges) ? curData.badges : [];

                    // Only keep items that are STILL new at commit time
                    const stillTasks = earnedTaskIds.filter((id) => !curTasks.includes(id));
                    const stillBadges = earnedBadgeIds.filter((id) => !curBadges.includes(id));

                    // Recompute the XP strictly from the still-new items
                    let stillXp = 0;
                    if (stillTasks.length) {
                        for (const id of stillTasks) {
                            const def = taskDefs.find((t) => t.id === id);
                            if (def) stillXp += Number(def.xpReward) || 0;
                        }
                    }
                    if (stillBadges.length) {
                        for (const id of stillBadges) {
                            const def = badgeDefs.find((b) => b.id === id);
                            if (def) stillXp += Number(def.xpReward) || 0;
                        }
                    }

                    if (!stillXp && !stillTasks.length && !stillBadges.length) return;

                    const update: any = { updatedAt: new Date() };
                    if (stillXp) update.xp = increment(stillXp);
                    if (stillTasks.length) update.completedTasks = arrayUnion(...stillTasks);
                    if (stillBadges.length) update.badges = arrayUnion(...stillBadges);

                    tx.set(userRef, update, { merge: true });
                });

                msgs.forEach((m) => triggerReward({ type: m.type, message: m.text }));
            } catch (e) {
                console.error("🔥 Award commit failed:", e);
            } finally {
                awardingRef.current = false;
            }

        });

        return () => {
            unsub();
            firstSnapRef.current = true; // reset for next mount
        };
    }, [user?.uid, defsReady, taskDefs, badgeDefs]);

    // ────────────────────────────────────────────────────────────────────────────
    // Public API: idempotent, transactional completion updaters
    // ────────────────────────────────────────────────────────────────────────────
    async function markResourceAsRead(resourceId: string, xpReward: number) {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userRef = doc(firestore, "users", currentUser.uid);

        try {
            await runTransaction(firestore, async (tx) => {
                const snap = await tx.get(userRef);
                const data = (snap.data() as any) || {};

                const resources: string[] = Array.isArray(data.completedResources)
                    ? data.completedResources
                    : [];
                const already = resources.includes(resourceId);

                // Streak update (once per day) tied to reading action; move elsewhere if desired
                const now = new Date();
                const lastRaw = data.lastLogin;
                const last = lastRaw instanceof Date ? lastRaw : lastRaw?.toDate?.() ?? null;
                let newStreak = Number(data.streak) || 0;
                if (!last) newStreak = 1;
                else {
                    const diff = daysBetweenUTC(now, new Date(last));
                    if (diff === 0) newStreak = newStreak; // same day
                    else if (diff === 1) newStreak = newStreak + 1; // consecutive day
                    else newStreak = 1; // gap
                }

                const update: any = {
                    lastLogin: now,
                    streak: newStreak,
                    "missions.daily.readGuide": true,
                    updatedAt: now,
                };

                if (!already) {
                    update.completedResources = arrayUnion(resourceId);
                    update.xp = increment(Number(xpReward) || 0);
                }

                tx.set(userRef, update, { merge: true });
            });

            Toast.show({
                type: "success",
                text1: i18n.t("learn.rewards.resourceMarked"),
                text2: `+${xpReward} XP`,
            });
        } catch (err) {
            console.error("Failed to mark resource complete (tx):", err);
        }
    }

    async function markQuizAsComplete(quizId: string, xpReward: number) {
        const currentUser = auth.currentUser;
        if (!currentUser) return { awarded: false, reason: "not-authenticated" } as const;

        const userRef = doc(firestore, "users", currentUser.uid);

        try {
            const result = await runTransaction(firestore, async (tx) => {
                const snap = await tx.get(userRef);
                const data = (snap.data() as any) || {};

                const quizzes: string[] = Array.isArray(data.completedQuizzes) ? data.completedQuizzes : [];
                const already = quizzes.includes(quizId);

                if (already) return { awarded: false, reason: "already-completed" } as const;

                const now = new Date();
                const update: any = {
                    completedQuizzes: arrayUnion(quizId),
                    xp: increment(Number(xpReward) || 0),
                    "missions.daily.completeQuiz": true,
                    updatedAt: now,
                };

                tx.set(userRef, update, { merge: true });
                return { awarded: true, reason: "ok" } as const;
            });

            return result;
        } catch (err) {
            console.error("Failed to mark quiz complete (tx):", err);
            return { awarded: false, reason: "tx-error" } as const;
        }
    }

    return { markResourceAsRead, markQuizAsComplete };
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function pickMilestones<T extends { kind: Kind; threshold: number }>(
    items: T[],
    progress: Record<Kind, number>,
    allowCatchup: boolean
): T[] {
    if (allowCatchup) {
        // grant ALL eligible milestones
        return items.filter((x) => x.threshold <= progress[x.kind]);
    }
    // grant ONLY the highest eligible milestone per kind
    const byKind = new Map<Kind, T[]>();
    for (const it of items) {
        const arr = byKind.get(it.kind) || [];
        arr.push(it);
        byKind.set(it.kind, arr);
    }
    const picks: T[] = [];
    for (const [kind, arr] of byKind.entries()) {
        const eligible = arr.filter((x) => x.threshold <= progress[kind]);
        if (!eligible.length) continue;
        eligible.sort((a, b) => b.threshold - a.threshold);
        picks.push(eligible[0]);
    }
    return picks;
}
