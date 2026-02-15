import React, { useState, useEffect } from "react";
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
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { INITIAL_LAMP_LIMIT, WARN_TIME } from "@/data/canonConstants";

interface BatteryIndicatorProps {
  lampLimit: number;
  lampLit: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function BatteryIndicator({ lampLimit, lampLit }: BatteryIndicatorProps) {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const pulseScale = useSharedValue(1);
  const tooltipScale = useSharedValue(0);

  const isDead = lampLimit < 0;
  const isLow = !isDead && lampLimit <= WARN_TIME && lampLit;
  const percent = isDead ? 0 : Math.min(1, Math.max(0, lampLimit / INITIAL_LAMP_LIMIT));

  useEffect(() => {
    if (isLow) {
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
  }, [isLow, pulseScale]);

  useEffect(() => {
    tooltipScale.value = withSpring(showTooltip ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [showTooltip, tooltipScale]);

  const getColor = () => {
    if (isDead) return theme.textSecondary;
    if (isLow) return theme.danger;
    if (percent <= 0.3) return theme.primaryDark;
    return theme.primary;
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - percent),
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

  const getStatusText = () => {
    if (isDead) return "OUT";
    if (!lampLit) return "OFF";
    if (isLow) return lampLimit.toString();
    return Math.round(percent * 100).toString();
  };

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
            Brass Lantern
          </ThemedText>
          <ThemedText style={[styles.tooltipText, { color: theme.textSecondary }]}>
            {isDead
              ? "Your lamp has burned out permanently."
              : !lampLit
              ? `Lamp is OFF. ${lampLimit} turns of fuel remain. Type "lamp on" to light it.`
              : `Lamp is ON. ${lampLimit} turns remaining. Find batteries to extend.`}
          </ThemedText>
          <View
            style={[styles.tooltipArrow, { borderBottomColor: theme.backgroundSecondary }]}
          />
        </Animated.View>
      ) : null}

      <Pressable onPress={handlePress} testID="battery-indicator">
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
            {isDead ? (
              <Feather name="x" size={16} color={theme.textSecondary} />
            ) : !lampLit ? (
              <Feather name="moon" size={14} color={theme.textSecondary} />
            ) : (
              <ThemedText style={[styles.text, { color: getColor() }]}>
                {getStatusText()}
              </ThemedText>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "visible",
    zIndex: 100,
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
    left: 0,
    top: 54,
    width: 180,
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
    left: 14,
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
});
