import React from "react";
import { View, StyleSheet, Modal, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { HELP_TEXT } from "@/data/story";

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpModal({ visible, onClose }: HelpModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <ThemedText type="h4">How to Play</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton} testID="help-close-button">
              <Feather name="x" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={[styles.helpText, { color: theme.text }]}>
              {HELP_TEXT}
            </ThemedText>

            <View style={styles.tipsSection}>
              <ThemedText
                type="h4"
                style={[styles.tipsTitle, { color: theme.primary }]}
              >
                Tips
              </ThemedText>
              <View style={styles.tip}>
                <Feather name="zap" size={16} color={theme.primary} />
                <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                  Watch your lamp life - when it runs out, you're in trouble.
                </ThemedText>
              </View>
              <View style={styles.tip}>
                <Feather name="map" size={16} color={theme.primary} />
                <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                  Explore thoroughly. Some items are essential for escape.
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    maxHeight: "95%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
  helpText: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  tipsSection: {
    gap: Spacing.md,
  },
  tipsTitle: {
    marginBottom: Spacing.sm,
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
