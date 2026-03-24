import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { Message } from "@/data/gameState";
import { useTypewriter } from "@/hooks/useTypewriter";

interface MessageBubbleProps {
  message: Message;
  isNew?: boolean;
  isPendingReveal?: boolean;
  onTypingComplete?: () => void;
}

function useBlinkingCursor(isTyping: boolean): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isTyping) {
      setVisible(true);
      return;
    }
    const id = setInterval(() => setVisible((v) => !v), 500);
    return () => clearInterval(id);
  }, [isTyping]);

  return visible;
}

export function MessageBubble({ message, isNew = false, isPendingReveal = false, onTypingComplete }: MessageBubbleProps) {
  const { theme } = useTheme();

  const isPlayerCommand = message.type === "action";
  const isNavHint = message.type === "nav-hint";
  const shouldTypewrite = isNew && !isPlayerCommand && !isNavHint;

  const { displayedText, isTyping } = useTypewriter(message.text, shouldTypewrite, onTypingComplete);
  const cursorVisible = useBlinkingCursor(isTyping);
  const textWithCursor = isTyping ? displayedText + (cursorVisible ? "\u258b" : " ") : displayedText;

  if (isPendingReveal) {
    return null;
  }

  if (isPlayerCommand) {
    const bubbleColor = theme.primaryDim;
    const textColor = theme.text;

    return (
      <View style={styles.playerRow}>
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
      </View>
    );
  }

  if (isNavHint) {
    return (
      <View style={styles.navHintRow}>
        <Feather
          name="compass"
          size={12}
          color={theme.textSecondary}
          style={styles.navHintIcon}
        />
        <ThemedText
          style={[
            styles.navHintText,
            { color: theme.textSecondary },
          ]}
        >
          {message.text}
        </ThemedText>
      </View>
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
    <View style={styles.narratorRow}>
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
        <ThemedText style={[styles.text, { color: getTextColor() }, message.mono ? { fontFamily: Fonts.mono, fontSize: 12, lineHeight: 18 } : undefined]}>
          {textWithCursor}
        </ThemedText>
      </View>
    </View>
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
  navHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: Spacing.md,
    marginTop: -Spacing.sm,
    paddingRight: Spacing["3xl"],
    paddingLeft: Spacing.sm,
    opacity: 0.7,
  },
  navHintIcon: {
    marginRight: 5,
  },
  navHintText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
    flexShrink: 1,
  },
});
