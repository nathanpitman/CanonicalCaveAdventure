import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { FlashlightBatteryIcon } from "@/components/FlashlightBatteryIcon";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Fonts } from "@/constants/theme";
import { INITIAL_LAMP_LIMIT } from "@/data/canonConstants";

interface TorchIndicatorProps {
  lampLimit: number;
  lampLit: boolean;
}

export function TorchIndicator({ lampLimit, lampLit }: TorchIndicatorProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<View>(null);

  const isDead = lampLimit <= 0;
  const isLit = lampLit && !isDead;
  const displayTurns = isDead ? 0 : Math.max(0, lampLimit);
  const chargePercent = isDead ? 0 : Math.min(100, (lampLimit / INITIAL_LAMP_LIMIT) * 100);

  const numberColor = isLit ? theme.text : theme.textSecondary;

  const handlePress = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!open || Platform.OS !== "web") return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const wrapper = document.querySelector('[data-testid="torch-wrapper"]');
      if (wrapper && !wrapper.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const tooltipText = isDead
    ? "Your lamp has burned out permanently."
    : !lampLit
    ? `Lamp is OFF. ${lampLimit} turns of fuel remain. Type "lamp on" to light it.`
    : `Lamp is ON. ${lampLimit} turns remaining. Find batteries to extend.`;

  return (
    <View
      ref={wrapperRef}
      style={styles.wrapper}
      testID="torch-wrapper"
      {...(Platform.OS === "web" ? { "data-testid": "torch-wrapper" } : {})}
    >
      <Pressable
        onPress={handlePress}
        style={styles.indicator}
        accessibilityRole="button"
        accessibilityLabel={`Lamp: ${displayTurns} turns remaining`}
        accessibilityState={{ expanded: open }}
        testID="torch-indicator"
      >
        <FlashlightBatteryIcon
          width={30}
          height={15}
          chargePercent={chargePercent}
          active={isLit}
          activeColor={theme.primary}
          inactiveColor={theme.textSecondary}
        />
        <ThemedText
          style={[
            styles.turnsText,
            { color: numberColor, fontFamily: Fonts?.mono },
          ]}
        >
          {displayTurns}
        </ThemedText>
      </Pressable>

      {open ? (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={[
            styles.tooltip,
            { backgroundColor: theme.backgroundSecondary },
          ]}
          accessibilityRole="summary"
          testID="torch-tooltip"
        >
          <ThemedText style={[styles.tooltipTitle, { color: theme.primary }]}>
            Brass Lantern
          </ThemedText>
          <ThemedText style={[styles.tooltipText, { color: theme.textSecondary }]}>
            {tooltipText}
          </ThemedText>
          <View
            style={[styles.tooltipArrow, { borderBottomColor: theme.backgroundSecondary }]}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "visible",
    zIndex: 100,
    alignItems: "flex-end",
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  turnsText: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    minWidth: 20,
    textAlign: "right",
  },
  tooltip: {
    position: "absolute",
    right: 0,
    top: 30,
    width: 180,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    zIndex: 200,
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
    right: 10,
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
