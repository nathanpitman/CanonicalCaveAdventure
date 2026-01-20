import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CommandInputProps {
  onSubmit: (command: string) => void;
  onHelp: () => void;
  onRestart: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = 220;
const DRAG_THRESHOLD = 60;

export function CommandInput({ onSubmit, onHelp, onRestart }: CommandInputProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);
  
  const translateY = useSharedValue(0);
  const isExpanded = useSharedValue(false);
  const startY = useSharedValue(0);

  const totalCollapsedHeight = COLLAPSED_HEIGHT + insets.bottom;
  const totalExpandedHeight = EXPANDED_HEIGHT + insets.bottom;

  const collapse = () => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    isExpanded.value = false;
  };

  const expand = () => {
    translateY.value = withSpring(-(totalExpandedHeight - totalCollapsedHeight), { 
      damping: 20, 
      stiffness: 200 
    });
    isExpanded.value = true;
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newY = startY.value + event.translationY;
      const maxUp = -(totalExpandedHeight - totalCollapsedHeight);
      translateY.value = Math.max(maxUp, Math.min(0, newY));
    })
    .onEnd((event) => {
      const threshold = DRAG_THRESHOLD;
      if (isExpanded.value) {
        if (event.translationY > threshold) {
          runOnJS(collapse)();
        } else {
          runOnJS(expand)();
        }
      } else {
        if (event.translationY < -threshold) {
          runOnJS(expand)();
        } else {
          runOnJS(collapse)();
        }
      }
    });

  const handleSubmit = () => {
    if (command.trim()) {
      onSubmit(command.trim());
      setCommand("");
    }
  };

  const handleRestartPress = () => {
    setShowConfirm(true);
  };

  const handleConfirmRestart = () => {
    setShowConfirm(false);
    collapse();
    onRestart();
  };

  const handleCancelRestart = () => {
    setShowConfirm(false);
  };

  const handleHelpPress = () => {
    collapse();
    onHelp();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      translateY.value,
      [-(totalExpandedHeight - totalCollapsedHeight), 0],
      [totalExpandedHeight, totalCollapsedHeight],
      Extrapolation.CLAMP
    );
    return {
      height,
    };
  });

  const menuOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-(totalExpandedHeight - totalCollapsedHeight), -20],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const handleIndicatorStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateY.value,
      [-(totalExpandedHeight - totalCollapsedHeight), 0],
      [180, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.backgroundDefault,
              borderTopColor: theme.backgroundSecondary,
              paddingBottom: insets.bottom,
            },
            containerAnimatedStyle,
          ]}
        >
          <View style={styles.handleContainer}>
            <Animated.View style={[styles.handleIndicator, handleIndicatorStyle]}>
              <Feather name="chevron-up" size={20} color={theme.textSecondary} />
            </Animated.View>
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: isFocused ? theme.primary : "transparent",
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: theme.text }, Platform.OS === "web" && { outlineStyle: "none" as any }]}
              placeholder="Enter command..."
              placeholderTextColor={theme.textDisabled}
              value={command}
              onChangeText={setCommand}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
              autoCapitalize="none"
              autoCorrect={false}
              testID="command-input"
            />
            <AnimatedPressable
              onPress={handleSubmit}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              style={[
                styles.sendButton,
                {
                  backgroundColor: command.trim() ? theme.primary : theme.backgroundTertiary,
                },
                buttonAnimatedStyle,
              ]}
              testID="send-button"
            >
              <Feather
                name="send"
                size={18}
                color={command.trim() ? theme.buttonText : theme.textDisabled}
              />
            </AnimatedPressable>
          </View>

          <Animated.View style={[styles.menuContainer, menuOpacity]}>
            <Pressable
              onPress={handleHelpPress}
              style={[styles.menuButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="help-circle" size={20} color={theme.primary} />
              <ThemedText style={styles.menuLabel}>Help</ThemedText>
            </Pressable>

            <Pressable
              onPress={handleRestartPress}
              style={[styles.menuButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="rotate-ccw" size={20} color={theme.danger} />
              <ThemedText style={[styles.menuLabel, { color: theme.danger }]}>
                Restart Story
              </ThemedText>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelRestart}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="h4" style={styles.confirmTitle}>
              Restart Story?
            </ThemedText>
            <ThemedText style={[styles.confirmText, { color: theme.textSecondary }]}>
              All progress will be lost. Are you sure you want to start over?
            </ThemedText>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={handleCancelRestart}
                style={[styles.confirmButton, { borderColor: theme.textSecondary }]}
              >
                <ThemedText style={{ color: theme.textSecondary }}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmRestart}
                style={[styles.confirmButton, styles.confirmButtonDanger, { backgroundColor: theme.danger }]}
              >
                <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>Restart</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  handleIndicator: {
    padding: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: Spacing.inputHeight,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  menuContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  confirmBox: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  confirmTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  confirmText: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  confirmButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  confirmButtonDanger: {
    borderWidth: 0,
  },
});
