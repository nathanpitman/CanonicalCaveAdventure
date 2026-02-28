import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { TorchIndicator } from "@/components/TorchIndicator";
import { ProgressChaptersBar } from "@/components/ProgressChaptersBar";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface GameHeaderProps {
  lampLimit: number;
  lampLit: boolean;
  sceneTitle: string;
  hasLamp: boolean;
  milestonesCompleted?: number;
}

export function GameHeader({
  lampLimit,
  lampLit,
  sceneTitle,
  hasLamp,
  milestonesCompleted = 0,
}: GameHeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const fullTitle = `Canonical / ${sceneTitle}`;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.xs,
            backgroundColor: theme.backgroundDefault,
          },
        ]}
      >
        <ProgressChaptersBar
          completed={milestonesCompleted}
          ariaLabel="Adventure progress"
        />
        <View style={styles.headerRow}>
          <ThemedText
            style={[styles.sceneTitle, { color: theme.text }]}
            numberOfLines={1}
            testID="header-title"
          >
            {fullTitle}
          </ThemedText>

          {hasLamp ? (
            <View style={styles.torchContainer}>
              <TorchIndicator lampLimit={lampLimit} lampLit={lampLit} />
            </View>
          ) : null}
        </View>
      </View>
      <LinearGradient
        colors={[theme.backgroundDefault, theme.backgroundDefault + "00"]}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1000,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    minHeight: 24,
  },
  sceneTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: Spacing.sm,
  },
  torchContainer: {
    flexShrink: 0,
    overflow: "visible",
    zIndex: 100,
  },
  fadeGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -20,
    height: 20,
  },
});
