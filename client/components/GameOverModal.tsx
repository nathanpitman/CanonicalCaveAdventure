import React from "react";
import { View, StyleSheet, Modal, Image } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface GameOverModalProps {
  visible: boolean;
  type: "escaped" | "died";
  onNewGame: () => void;
}

export function GameOverModal({
  visible,
  type,
  onNewGame,
}: GameOverModalProps) {
  const { theme } = useTheme();

  const isEscaped = type === "escaped";

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.85)" }]}
      >
        <Animated.View
          entering={ZoomIn.duration(400).delay(300)}
          style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        >
          {isEscaped ? (
            <Image
              source={require("../../assets/images/escape-success.png")}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}

          <ThemedText
            type="h2"
            style={[
              styles.title,
              { color: isEscaped ? theme.success : theme.danger },
            ]}
          >
            {isEscaped ? "You Escaped!" : "Darkness Claims You"}
          </ThemedText>

          <ThemedText
            style={[styles.description, { color: theme.textSecondary }]}
          >
            {isEscaped
              ? "You emerge from the chasm into the light of day. The nightmare is over. You are free."
              : "The lamp sputters and dies. In the absolute darkness of the deep earth, you are lost forever."}
          </ThemedText>

          <Button onPress={onNewGame} style={styles.button}>
            Play Again
          </Button>
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
    maxWidth: 340,
    padding: Spacing["2xl"],
    borderRadius: BorderRadius["2xl"],
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
  },
  button: {
    width: "100%",
  },
});
