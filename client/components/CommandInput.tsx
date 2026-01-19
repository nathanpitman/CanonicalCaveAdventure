import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CommandInputProps {
  onSubmit: (command: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CommandInput({ onSubmit }: CommandInputProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);

  const handleSubmit = () => {
    if (command.trim()) {
      onSubmit(command.trim());
      setCommand("");
    }
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderTopColor: isFocused ? theme.primary : theme.backgroundSecondary,
          paddingBottom: Math.max(insets.bottom, Spacing.md),
        },
      ]}
    >
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
          style={[styles.input, { color: theme.text }]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
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
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
