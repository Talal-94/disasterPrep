// components/learn/SkeletonResourceCard.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

export default function SkeletonResourceCard() {
  // Animated value for opacity shimmer
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.textBlock} />
      </View>
      <View style={styles.line} />
      <View style={styles.meta} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
  },
  textBlock: {
    flex: 1,
    height: 16,
    marginLeft: 12,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  line: {
    height: 12,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
