import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Minimap } from "./Minimap";
import { useTheme } from "@/hooks/useTheme";

const DRAWER_WIDTH = 260;

interface MinimapDrawerProps {
  visible: boolean;
  visitHistory: string[];
  currentSceneId: string;
  onClose: () => void;
}

export function MinimapDrawer({
  visible,
  visitHistory,
  currentSceneId,
  onClose,
}: MinimapDrawerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(visible ? 0 : -DRAWER_WIDTH, {
      damping: 20,
      stiffness: 200,
    });
  }, [visible, translateX]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -50 || event.velocityX < -500) {
        translateX.value = withSpring(-DRAWER_WIDTH, {
          damping: 20,
          stiffness: 200,
        });
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayOpacity = useAnimatedStyle(() => ({
    opacity: (translateX.value + DRAWER_WIDTH) / DRAWER_WIDTH * 0.5,
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
            styles.drawer,
            drawerStyle,
            { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Minimap
            visitHistory={visitHistory}
            currentSceneId={currentSceneId}
            onClose={onClose}
            showCloseButton={true}
          />
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
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
  },
});
