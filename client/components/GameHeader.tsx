import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { LampIndicator } from "@/components/LampIndicator";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface GameHeaderProps {
  light: number;
  sceneTitle: string;
  hasLamp: boolean;
  onMinimapPress?: () => void;
  showMinimapButton?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GameHeader({
  light,
  sceneTitle,
  hasLamp,
  onMinimapPress,
  showMinimapButton = false,
}: GameHeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerScale = useSharedValue(1);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const handlePressIn = () => {
    headerScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    headerScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

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
            {hasLamp ? <LampIndicator light={light} /> : null}
          </View>
          
          {showMinimapButton && onMinimapPress ? (
            <AnimatedPressable
              onPress={onMinimapPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.titleTouchable, headerAnimatedStyle]}
              testID="minimap-button"
            >
              <Feather name="map" size={16} color={theme.primary} style={styles.mapIcon} />
              <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
                {fullTitle}
              </ThemedText>
              <Feather name="chevron-down" size={12} color={theme.textSecondary} style={styles.chevron} />
            </AnimatedPressable>
          ) : (
            <View style={styles.titleContainer}>
              <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
                {fullTitle}
              </ThemedText>
            </View>
          )}
          
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
  titleTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  mapIcon: {
    marginRight: 6,
  },
  chevron: {
    marginLeft: 4,
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
