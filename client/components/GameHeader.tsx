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

  const fullTitle = `Ascent / ${sceneTitle}`;

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
        {showMinimapButton && onMinimapPress ? (
          <AnimatedPressable
            onPress={onMinimapPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.headerTouchable, headerAnimatedStyle]}
            testID="minimap-button"
          >
            <View style={styles.mapIconContainer}>
              <Feather name="map" size={18} color={theme.primary} />
            </View>
            <View style={styles.titleContainer}>
              <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
                {fullTitle}
              </ThemedText>
              <Feather name="chevron-down" size={12} color={theme.textSecondary} />
            </View>
            <View style={styles.rightContainer}>
              {hasLamp ? <LampIndicator light={light} /> : <View style={styles.placeholder} />}
            </View>
          </AnimatedPressable>
        ) : (
          <View style={styles.headerRow}>
            <View style={styles.placeholder} />
            <View style={styles.titleCenterContainer}>
              <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
                {fullTitle}
              </ThemedText>
            </View>
            <View style={styles.rightContainer}>
              {hasLamp ? <LampIndicator light={light} /> : <View style={styles.placeholder} />}
            </View>
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  mapIconContainer: {
    padding: Spacing.xs,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  titleCenterContainer: {
    flex: 1,
    alignItems: "center",
  },
  sceneTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  rightContainer: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  placeholder: {
    width: 44,
  },
  fadeGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -20,
    height: 20,
  },
});
