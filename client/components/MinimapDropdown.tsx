import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Minimap } from "./Minimap";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const DROPDOWN_HEIGHT = 320;

interface MinimapDropdownProps {
  visible: boolean;
  visitHistory: string[];
  currentSceneId: string;
  onClose: () => void;
}

export function MinimapDropdown({
  visible,
  visitHistory,
  currentSceneId,
  onClose,
}: MinimapDropdownProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-DROPDOWN_HEIGHT - insets.top);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -DROPDOWN_HEIGHT - insets.top - 50, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, translateY, insets.top]);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        translateY.value = withTiming(-DROPDOWN_HEIGHT - insets.top - 50, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const dropdownStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayOpacity = useAnimatedStyle(() => ({
    opacity: (translateY.value + DROPDOWN_HEIGHT + insets.top) / (DROPDOWN_HEIGHT + insets.top) * 0.5,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={visible ? "auto" : "none"}
    >
      <Animated.View style={[styles.overlay, overlayOpacity]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.dropdown,
            dropdownStyle,
            { 
              paddingTop: insets.top,
              width: screenWidth,
              backgroundColor: theme.backgroundDefault,
            },
          ]}
        >
          <View style={styles.header}>
            <ThemedText type="h4" style={styles.title}>Journey</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton} testID="dropdown-close">
              <Feather name="x" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.minimapContainer}>
            <Minimap
              visitHistory={visitHistory}
              currentSceneId={currentSceneId}
              showCloseButton={false}
            />
          </View>

          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.textSecondary }]} />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  dropdown: {
    position: "absolute",
    left: 0,
    top: 0,
    height: DROPDOWN_HEIGHT,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  minimapContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
});
