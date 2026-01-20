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
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface GameHeaderProps {
  light: number;
  onMinimapPress?: () => void;
  showMinimapButton?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GameHeader({
  light,
  onMinimapPress,
  showMinimapButton = false,
}: GameHeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const mapScale = useSharedValue(1);

  const mapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mapScale.value }],
  }));

  const handleMapPressIn = () => {
    mapScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handleMapPressOut = () => {
    mapScale.value = withSpring(1, { damping: 15, stiffness: 300 });
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
          onPressIn={handleMapPressIn}
          onPressOut={handleMapPressOut}
          style={[styles.mapButton, mapAnimatedStyle]}
          testID="minimap-button"
        >
          <Feather name="map" size={22} color={theme.primary} />
        </AnimatedPressable>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.spacer} />

      <LampIndicator light={light} />
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
  mapButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  spacer: {
    flex: 1,
  },
});
