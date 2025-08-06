// components/animations/ConfettiLottie.tsx
import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";

export default function ConfettiLottie({
  onFinish,
}: {
  onFinish?: () => void;
}) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LottieView
        ref={animation}
        source={require("../../assets/lottie/success confetti.json")}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
