import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface LampIndicatorProps {
  light: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function LampIndicator({ light }: LampIndicatorProps) {
  const { theme } = useTheme();
  const [showPopover, setShowPopover] = useState(false);
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (light <= 20 && light > 0) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [light, pulseScale]);

  const getColor = () => {
    if (light <= 20) return theme.danger;
    if (light <= 40) return theme.primaryDark;
    return theme.primary;
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - light / 100),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <>
      <Pressable onPress={() => setShowPopover(true)} testID="lamp-indicator">
        <Animated.View style={[styles.container, pulseStyle]}>
          <Svg width={size} height={size} style={styles.svg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.backgroundSecondary}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getColor()}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.textContainer}>
            <ThemedText style={[styles.text, { color: getColor() }]}>
              {light}
            </ThemedText>
          </View>
        </Animated.View>
      </Pressable>

      <Modal
        visible={showPopover}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopover(false)}
      >
        <Pressable 
          style={styles.popoverOverlay} 
          onPress={() => setShowPopover(false)}
        >
          <View style={[styles.popover, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="h4" style={styles.popoverTitle}>
              Lamp Fuel
            </ThemedText>
            <ThemedText style={[styles.popoverText, { color: theme.textSecondary }]}>
              This shows how much fuel remains in your lamp. Each action consumes fuel. 
              When the lamp runs out, darkness consumes you.
            </ThemedText>
            <ThemedText style={[styles.popoverHint, { color: theme.primary }]}>
              Find fuel canisters to keep your light burning.
            </ThemedText>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  textContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
  popoverOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  popover: {
    maxWidth: 300,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  popoverTitle: {
    marginBottom: Spacing.sm,
  },
  popoverText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  popoverHint: {
    fontSize: 13,
    fontWeight: "600",
  },
});
