import React, { useState } from "react";
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
import { trackHelpOpened, trackRestartGame } from "@/analytics";

interface GameMenuProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
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
  onHelp,
}: GameMenuProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRestartPress = () => {
    setShowConfirm(true);
  };

  const handleConfirmRestart = () => {
    setShowConfirm(false);
    trackRestartGame();
    onNewGame();
  };

  const handleCancelRestart = () => {
    setShowConfirm(false);
  };

  return (
    <>
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
              Canonical
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              A Text Adventure
            </ThemedText>
          </View>

          <View style={styles.menuItems}>
            <MenuItem icon="rotate-ccw" label="Restart Story" onPress={handleRestartPress} danger />
            <MenuItem icon="help-circle" label="Help" onPress={() => { trackHelpOpened(); onHelp(); }} />
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
