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
  onMenuPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GameHeader({ light, onMenuPress }: GameHeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const menuScale = useSharedValue(1);

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
  }));

  const handleMenuPressIn = () => {
    menuScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handleMenuPressOut = () => {
    menuScale.value = withSpring(1, { damping: 15, stiffness: 300 });
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
      <AnimatedPressable
        onPress={onMenuPress}
        onPressIn={handleMenuPressIn}
        onPressOut={handleMenuPressOut}
        style={[styles.menuButton, menuAnimatedStyle]}
        testID="menu-button"
      >
        <Feather name="menu" size={24} color={theme.text} />
      </AnimatedPressable>

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
  menuButton: {
    padding: Spacing.sm,
  },
  spacer: {
    flex: 1,
  },
});
