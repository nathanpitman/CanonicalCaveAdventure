import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.sm,
          backgroundColor: theme.backgroundRoot + "E6",
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
            <Feather name="map" size={20} color={theme.primary} />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
              {sceneTitle}
            </ThemedText>
            <Feather name="chevron-down" size={14} color={theme.textSecondary} />
          </View>
        </AnimatedPressable>
      ) : (
        <View style={styles.titleOnlyContainer}>
          <ThemedText style={[styles.sceneTitle, { color: theme.text }]} numberOfLines={1}>
            {sceneTitle}
          </ThemedText>
        </View>
      )}

      <View style={styles.rightContainer}>
        {hasLamp ? <LampIndicator light={light} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  mapIconContainer: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleOnlyContainer: {
    flex: 1,
    alignItems: "center",
  },
  sceneTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rightContainer: {
    minWidth: 44,
    alignItems: "flex-end",
  },
});
