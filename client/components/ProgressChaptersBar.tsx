import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface ProgressChaptersBarProps {
  total?: number;
  completed: number;
  ariaLabel?: string;
}

export function ProgressChaptersBar({
  total = 14,
  completed,
  ariaLabel = "Game progress",
}: ProgressChaptersBarProps) {
  const { theme } = useTheme();
  const prevCompleted = useRef(completed);
  const pulseAnims = useRef<Animated.Value[]>(
    Array.from({ length: total }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    if (completed > prevCompleted.current) {
      for (let i = prevCompleted.current; i < completed && i < total; i++) {
        pulseAnims[i].setValue(1.8);
        Animated.timing(pulseAnims[i], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
    prevCompleted.current = completed;
  }, [completed, total, pulseAnims]);

  const segments = Array.from({ length: total }, (_, i) => {
    const filled = i < completed;
    return (
      <Animated.View
        key={i}
        style={[
          styles.segment,
          {
            backgroundColor: filled ? theme.primary : theme.backgroundTertiary,
            opacity: pulseAnims[i].interpolate({
              inputRange: [1, 1.8],
              outputRange: [1, 0.6],
            }),
            transform: [
              {
                scaleY: pulseAnims[i].interpolate({
                  inputRange: [1, 1.8],
                  outputRange: [1, 1.5],
                }),
              },
            ],
          },
          i === 0 && styles.firstSegment,
          i === total - 1 && styles.lastSegment,
        ]}
      />
    );
  });

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={ariaLabel}
      accessibilityValue={{
        min: 0,
        max: total,
        now: completed,
      }}
    >
      {segments}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 5,
    gap: 2,
    paddingHorizontal: 2,
  },
  segment: {
    flex: 1,
    height: 5,
    borderRadius: 1,
  },
  firstSegment: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  lastSegment: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});
