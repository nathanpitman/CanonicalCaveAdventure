import React from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { PendingPrompt } from "@/data/gameState";

interface PendingPromptModalProps {
  prompt: PendingPrompt | null;
  onYes: () => void;
  onNo: () => void;
}

export function PendingPromptModal({
  prompt,
  onYes,
  onNo,
}: PendingPromptModalProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={prompt !== null} transparent animationType="none">
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.75)" }]}
      >
        <Animated.View
          entering={ZoomIn.duration(300).delay(100)}
          style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText
            style={[styles.promptText, { color: theme.text }]}
          >
            {prompt?.text || ""}
          </ThemedText>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onYes}
              style={[
                styles.promptButton,
                { backgroundColor: theme.primary },
              ]}
              testID="prompt-yes"
            >
              <ThemedText
                type="body"
                style={[styles.promptButtonText, { color: theme.buttonText }]}
              >
                Yes
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onNo}
              style={[
                styles.promptButton,
                { backgroundColor: theme.backgroundTertiary },
              ]}
              testID="prompt-no"
            >
              <ThemedText
                type="body"
                style={[styles.promptButtonText, { color: theme.text }]}
              >
                No
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "stretch",
  },
  promptText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  promptButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  promptButtonText: {
    fontWeight: "600",
  },
});
