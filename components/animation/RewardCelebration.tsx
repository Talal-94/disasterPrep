import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

type Props = {
  message: string;
  onDone: () => void;
};

export default function RewardCelebration({ message, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onDone);
  }, []);

  useEffect(() => {
    Toast.show({
      type: "success",
      text1: message,
    });
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, zIndex: 999 }]}>
      <BlurView intensity={50} tint="light" style={styles.blur}>
        <LottieView
          source={require("../../assets/lottie/success confetti.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    position: "absolute",
    width,
    height,
  },
  messageBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
