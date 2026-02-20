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

  const isPlayerCommand = message.type === "action";

  if (isPlayerCommand) {
    const bubbleColor = theme.primaryDim;
    const textColor = theme.text;

    return (
      <Animated.View style={[styles.playerRow, animatedStyle]}>
        <View style={styles.playerBubbleWrapper}>
          <View
            style={[
              styles.playerBubble,
              { backgroundColor: bubbleColor },
            ]}
          >
            <ThemedText
              style={[styles.playerText, { color: textColor }]}
            >
              {message.text}
            </ThemedText>
          </View>
          <View
            style={[
              styles.tailRight,
              {
                borderLeftColor: bubbleColor,
              },
            ]}
          />
        </View>
      </Animated.View>
    );
  }

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
      case "warning":
        return theme.danger;
      default:
        return theme.text;
    }
  };

  const messageStyles = getMessageStyles();

  return (
    <Animated.View style={[styles.narratorRow, animatedStyle]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: messageStyles.backgroundColor,
            borderLeftColor: messageStyles.borderLeftColor,
            borderLeftWidth: messageStyles.borderLeftWidth,
          },
        ]}
      >
        <ThemedText style={[styles.text, { color: getTextColor() }]}>
          {message.text}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

const TAIL_SIZE = 8;

const styles = StyleSheet.create({
  narratorRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: Spacing.md,
    paddingRight: Spacing["3xl"],
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: Spacing.md,
    paddingLeft: Spacing["3xl"],
  },
  playerBubbleWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  playerBubble: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderBottomRightRadius: Spacing.xs,
    maxWidth: "100%",
  },
  tailRight: {
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_SIZE,
    borderTopWidth: TAIL_SIZE,
    borderLeftColor: "transparent",
    borderTopColor: "transparent",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginLeft: -1,
    marginBottom: 0,
  },
  playerText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    maxWidth: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
