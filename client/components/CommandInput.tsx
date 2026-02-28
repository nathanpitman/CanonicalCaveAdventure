import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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

const CONTENT_COLLAPSED_HEIGHT = 68 + Spacing.md;
const MENU_SPACING = Spacing.md;
const MENU_BUTTON_HEIGHT = 40;
const CONTENT_EXPANDED_HEIGHT = CONTENT_COLLAPSED_HEIGHT + MENU_SPACING + MENU_BUTTON_HEIGHT;
const DRAG_THRESHOLD = 50;

const PLACEHOLDER_EXAMPLES = [
  "look around",
  "take lamp",
  "go north",
  "take keys",
  "inventory",
  "go inside",
  "grab bottle",
  "head east",
];

export function CommandInput({ 
  onSubmit, 
  onHelp, 
  onRestart,
}: CommandInputProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);
  const placeholderOpacity = useSharedValue(1);
  
  const translateY = useSharedValue(0);
  const isExpanded = useSharedValue(false);
  const startY = useSharedValue(0);

  const safeAreaBottom = Platform.OS === "web" ? 0 : insets.bottom;
  const totalCollapsedHeight = CONTENT_COLLAPSED_HEIGHT + MENU_SPACING;
  const totalExpandedHeight = CONTENT_EXPANDED_HEIGHT + MENU_SPACING;

  useEffect(() => {
    if (isFocused || command.length > 0) return;

    const interval = setInterval(() => {
      placeholderOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setPlaceholderIndex)((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
          placeholderOpacity.value = withTiming(1, { duration: 300 });
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, command, placeholderOpacity]);

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
  }));

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
      requestAnimationFrame(() => {
        if (!showConfirm) {
          inputRef.current?.focus();
        }
      });
    }
  };

  const handleRestartPress = () => {
    setShowConfirm(true);
  };

  const handleConfirmRestart = () => {
    setShowConfirm(false);
    onRestart();
  };

  const handleCancelRestart = () => {
    setShowConfirm(false);
  };

  const handleHelpPress = () => {
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

  const currentPlaceholder = PLACEHOLDER_EXAMPLES[placeholderIndex];

  return (
    <>
      <View style={{ backgroundColor: theme.backgroundDefault }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.container,
              {
                backgroundColor: theme.backgroundDefault,
                borderTopColor: theme.backgroundSecondary,
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
              <View style={styles.inputWrapper}>
                {!isFocused && command.length === 0 ? (
                  <Animated.View style={[styles.placeholderContainer, placeholderAnimatedStyle]}>
                    <ThemedText style={[styles.placeholder, { color: theme.textDisabled }]}>
                      {currentPlaceholder}
                    </ThemedText>
                  </Animated.View>
                ) : null}
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: theme.text }, Platform.OS === "web" && { outlineStyle: "none" as any }]}
                  placeholderTextColor="transparent"
                  value={command}
                  onChangeText={setCommand}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="send"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance={isDark ? "dark" : "light"}
                  testID="command-input"
                />
              </View>
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
                  name="arrow-up"
                  size={20}
                  color={command.trim() ? theme.buttonText : theme.textDisabled}
                />
              </AnimatedPressable>
            </View>

            <Animated.View style={[styles.menuContainer, menuOpacity]}>
              <Pressable
                onPress={handleHelpPress}
                style={[styles.menuButton, { backgroundColor: theme.backgroundSecondary }]}
                testID="help-button"
              >
                <Feather name="help-circle" size={20} color={theme.primary} />
                <ThemedText style={styles.menuLabel}>How to Play</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleRestartPress}
                style={[styles.menuButton, { backgroundColor: theme.backgroundSecondary }]}
                testID="restart-button"
              >
                <Feather name="rotate-ccw" size={20} color={theme.danger} />
                <ThemedText style={[styles.menuLabel, { color: theme.danger }]}>
                  Restart Story
                </ThemedText>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <View
          style={[
            styles.safeAreaBleed,
            {
              backgroundColor: theme.backgroundDefault,
              height: safeAreaBottom,
            },
            Platform.OS === "web" && {
              height: `env(safe-area-inset-bottom, 0px)` as any,
            },
          ]}
        />
      </View>

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
    paddingBottom: MENU_SPACING,
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
    paddingVertical: Spacing.xs,
    borderWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  placeholderContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    pointerEvents: "none",
  },
  placeholder: {
    fontSize: 16,
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
  safeAreaBleed: {
    width: "100%",
  },
  menuContainer: {
    flexDirection: "row",
    marginTop: MENU_SPACING,
    gap: Spacing.sm,
  },
  menuButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  menuLabel: {
    fontSize: 14,
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
