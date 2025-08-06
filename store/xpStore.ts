// store/xpStore.ts
import i18n from "@/utils/locales/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface XPState {
  xp: number;
  level: number;
  badges: string[];
  completedResources: string[];
  completedQuizzes: string[];
  completedTasks: string[];

  setXP: (xp: number) => void;
  addXP: (points: number) => void;

  setBadges: (badges: string[]) => void;
  addBadge: (badge: string) => void;

  setCompletedResources: (ids: string[]) => void;
  addCompletedResource: (id: string) => void;

  setCompletedQuizzes: (ids: string[]) => void;
  addCompletedQuiz: (id: string) => void;

  setCompletedTasks: (ids: string[]) => void;
  addCompletedTask: (id: string) => void;

  // 👇 NEW: reward UI trigger
  rewardEvent: null | { type: "task" | "level" | "badge"; message: string };
  triggerReward: (event: { type: "task" | "level" | "badge"; message: string }) => void;
  clearReward: () => void;

  // Reset everything back to defaults
  reset: () => void;
}

const getLevelFromXP = (xp: number) => Math.floor(xp / 100) + 1;

export const useXPStore = create<XPState>()(
  persist(
    (set) => ({
      // initial state
      xp: 0,
      level: 1,
      badges: [],
      completedResources: [],
      completedQuizzes: [],
      completedTasks: [],

      rewardEvent: null,
      triggerReward: (event) => set({ rewardEvent: event }),
      clearReward: () => set({ rewardEvent: null }),

      // XP actions
      setXP: (xp) => set({ xp, level: getLevelFromXP(xp) }),
      addXP: (points) =>
        set((state) => {
          const newXP = state.xp + points;
          const newLevel = getLevelFromXP(newXP);
          const oldLevel = state.level;

          if (newLevel > oldLevel) {
            return {
              xp: newXP,
              level: newLevel,
              rewardEvent: {
                type: "level",
                message: i18n.t("learn.rewards.levelUp", { level: newLevel }),
              },
            };
          }

          return { xp: newXP, level: newLevel };
        }),

      // Badge actions
      setBadges: (badges) => set({ badges }),
      addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),

      // Resource actions
      setCompletedResources: (ids) => set({ completedResources: ids }),
      addCompletedResource: (id) =>
        set((state) => ({
          completedResources: [...state.completedResources, id],
        })),

      // Quiz actions
      setCompletedQuizzes: (ids) => set({ completedQuizzes: ids }),
      addCompletedQuiz: (id) =>
        set((state) => ({ completedQuizzes: [...state.completedQuizzes, id] })),

      // Task actions
      setCompletedTasks: (ids) => set({ completedTasks: ids }),
      addCompletedTask: (id) =>
        set((state) => ({ completedTasks: [...state.completedTasks, id] })),

      // Reset local store to defaults
      reset: () =>
        set({
          xp: 0,
          level: 1,
          badges: [],
          completedResources: [],
          completedQuizzes: [],
          completedTasks: [],
          rewardEvent: null,
        }),
    }),
    {
      name: "xp-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
