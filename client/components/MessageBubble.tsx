import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Message } from "@/data/gameState";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      Math.min(index * 50, 200),
      withSpring(1, { damping: 20, stiffness: 200 })
    );
    translateY.value = withDelay(
      Math.min(index * 50, 200),
      withSpring(0, { damping: 20, stiffness: 200 })
    );
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getMessageStyles = () => {
    switch (message.type) {
      case "narration":
        return {
          backgroundColor: theme.backgroundDefault,
          borderLeftColor: theme.primary,
          borderLeftWidth: 3,
        };
      case "system":
        return {
          backgroundColor: theme.backgroundSecondary,
          borderLeftColor: theme.textSecondary,
          borderLeftWidth: 2,
        };
      case "action":
        return {
          backgroundColor: "transparent",
          borderLeftColor: "transparent",
          borderLeftWidth: 0,
        };
      case "warning":
        return {
          backgroundColor: theme.backgroundDefault,
          borderLeftColor: theme.danger,
          borderLeftWidth: 3,
        };
      default:
        return {
          backgroundColor: theme.backgroundDefault,
          borderLeftColor: theme.primary,
          borderLeftWidth: 3,
        };
    }
  };

  const getTextColor = () => {
    switch (message.type) {
      case "action":
        return theme.textSecondary;
      case "warning":
        return theme.danger;
      default:
        return theme.text;
    }
  };

  const messageStyles = getMessageStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: messageStyles.backgroundColor,
          borderLeftColor: messageStyles.borderLeftColor,
          borderLeftWidth: messageStyles.borderLeftWidth,
        },
        message.type === "action" && styles.actionContainer,
        animatedStyle,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          { color: getTextColor() },
          message.type === "action" && styles.actionText,
        ]}
      >
        {message.text}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  actionContainer: {
    padding: Spacing.sm,
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionText: {
    fontStyle: "italic",
    fontSize: 14,
  },
});
