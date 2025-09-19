import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, View, InteractionManager } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";

type Props = { message: string; onDone?: () => void };

export default function RewardCelebration({ message, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1200),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        InteractionManager.runAfterInteractions(() => {
          // schedule after layout/insertions have finished
          onDone?.();
        });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [opacity, translateY, onDone]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject as any}>
      <Animated.View
        style={[
          styles.wrap,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Card style={styles.card}>
          <Text style={styles.text}>{message}</Text>
        </Card>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.15,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(1.5),
  },
  text: { color: theme.colors.text, fontWeight: "700" },
}));
