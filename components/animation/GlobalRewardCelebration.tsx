import { useXPStore } from "@/store/xpStore";
import RewardCelebration from "@/components/animation/RewardCelebration";

export default function GlobalRewardCelebration() {
  const { rewardEvent, clearReward } = useXPStore();

  if (!rewardEvent) return null;

  return (
    <RewardCelebration
      key={rewardEvent.message}
      message={rewardEvent.message}
      onDone={clearReward}
    />
  );
}
