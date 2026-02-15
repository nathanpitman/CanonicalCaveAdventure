import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { BatteryIndicator } from "@/components/BatteryIndicator";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface GameHeaderProps {
  lampLimit: number;
  lampLit: boolean;
  sceneTitle: string;
  hasLamp: boolean;
}

export function GameHeader({
  lampLimit,
  lampLit,
  sceneTitle,
  hasLamp,
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
            paddingTop: insets.top + Spacing.sm,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.spacer}>
            {hasLamp ? <BatteryIndicator lampLimit={lampLimit} lampLit={lampLit} /> : null}
          </View>

          <View style={styles.titleContainer}>
            <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
              {fullTitle}
            </ThemedText>
          </View>

          <View style={styles.spacer} />
        </View>
      </View>
      <LinearGradient
        colors={[theme.backgroundRoot, "transparent"]}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spacer: {
    width: 50,
    alignItems: "flex-start",
    overflow: "visible",
    zIndex: 100,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  sceneTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  fadeGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -20,
    height: 20,
  },
});
