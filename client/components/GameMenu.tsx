import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface GameMenuProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onSave: () => void;
  onLoad: () => void;
  onHelp: () => void;
}

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MenuItem({ icon, label, onPress, danger }: MenuItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.menuItem,
        { backgroundColor: theme.backgroundSecondary },
        animatedStyle,
      ]}
    >
      <Feather
        name={icon}
        size={22}
        color={danger ? theme.danger : theme.primary}
      />
      <ThemedText
        style={[
          styles.menuLabel,
          { color: danger ? theme.danger : theme.text },
        ]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function GameMenu({
  visible,
  onClose,
  onNewGame,
  onSave,
  onLoad,
  onHelp,
}: GameMenuProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.6)" }]}
        />
      </Pressable>

      <Animated.View
        entering={SlideInLeft.duration(300).springify()}
        exiting={SlideOutLeft.duration(200)}
        style={[
          styles.menuContainer,
          {
            backgroundColor: theme.backgroundDefault,
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="h3" style={styles.title}>
            Ascent
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            A Text Adventure
          </ThemedText>
        </View>

        <View style={styles.menuItems}>
          <MenuItem icon="plus-circle" label="New Game" onPress={onNewGame} danger />
          <MenuItem icon="save" label="Save Game" onPress={onSave} />
          <MenuItem icon="download" label="Load Game" onPress={onLoad} />
          <MenuItem icon="help-circle" label="Help" onPress={onHelp} />
        </View>

        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { borderColor: theme.textSecondary }]}
        >
          <Feather name="x" size={20} color={theme.textSecondary} />
          <ThemedText style={[styles.closeLabel, { color: theme.textSecondary }]}>
            Close
          </ThemedText>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
  },
  menuItems: {
    flex: 1,
    gap: Spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  closeLabel: {
    fontSize: 14,
  },
});
