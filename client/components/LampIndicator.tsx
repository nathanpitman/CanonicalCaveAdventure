import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface LampIndicatorProps {
  light: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function LampIndicator({ light }: LampIndicatorProps) {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const pulseScale = useSharedValue(1);
  const tooltipScale = useSharedValue(0);

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

  useEffect(() => {
    tooltipScale.value = withSpring(showTooltip ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [showTooltip, tooltipScale]);

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

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipScale.value,
    transform: [{ scale: tooltipScale.value }],
  }));

  const handlePress = () => {
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <View style={styles.wrapper}>
      {showTooltip ? (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={[
            styles.tooltip,
            tooltipStyle,
            { backgroundColor: theme.backgroundSecondary },
          ]}
          testID="lamp-tooltip"
        >
          <ThemedText style={[styles.tooltipTitle, { color: theme.primary }]}>
            Lamp Fuel
          </ThemedText>
          <ThemedText style={[styles.tooltipText, { color: theme.textSecondary }]}>
            Actions consume fuel. Find canisters to refuel.
          </ThemedText>
          <View
            style={[styles.tooltipArrow, { borderTopColor: theme.backgroundSecondary }]}
          />
        </Animated.View>
      ) : null}

      <Pressable
        onPress={handlePress}
        testID="lamp-indicator"
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
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
  tooltip: {
    position: "absolute",
    right: 0,
    bottom: 54,
    width: 140,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    zIndex: 100,
  },
  tooltipTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },
  tooltipText: {
    fontSize: 10,
    lineHeight: 14,
  },
  tooltipArrow: {
    position: "absolute",
    right: 14,
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
