import React from "react";
import { View, StyleSheet, Modal, ScrollView, Pressable, Text } from "react-native";
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

function renderHelpContent(helpText: string, textColor: string, secondaryColor: string) {
  const lines = helpText.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "") {
      elements.push(<View key={`spacer-${i}`} style={styles.sectionSpacer} />);
      continue;
    }

    if (line.match(/^[A-Z][A-Z\s]+:/) && !line.startsWith("- ")) {
      const colonIdx = line.indexOf(":");
      const heading = line.substring(0, colonIdx);
      const rest = line.substring(colonIdx + 1).trim();

      elements.push(
        <View key={`heading-${i}`} style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionHeaderText, { color: textColor }]}>
            {heading}
          </ThemedText>
          {rest.length > 0 ? (
            <ThemedText style={[styles.bodyText, { color: secondaryColor }]}>
              {rest}
            </ThemedText>
          ) : null}
        </View>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const content = line.substring(2);
      const colonIdx = content.indexOf(":");
      let command = "";
      let description = "";

      if (colonIdx > 0) {
        command = content.substring(0, colonIdx);
        description = content.substring(colonIdx + 1).trim();
      } else {
        description = content;
      }

      elements.push(
        <View key={`bullet-${i}`} style={styles.bulletItem}>
          <Text style={[styles.bulletDot, { color: secondaryColor }]}>{"\u2022"}</Text>
          <ThemedText style={[styles.bulletText, { color: textColor }]}>
            {command.length > 0 ? (
              <>
                <Text style={styles.commandName}>{command}</Text>
                <Text style={{ color: secondaryColor }}>: {description}</Text>
              </>
            ) : (
              <Text style={{ color: secondaryColor }}>{description}</Text>
            )}
          </ThemedText>
        </View>
      );
      continue;
    }

    elements.push(
      <ThemedText key={`text-${i}`} style={[styles.bodyText, { color: secondaryColor }]}>
        {line}
      </ThemedText>
    );
  }

  return elements;
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
            <View style={styles.helpContent}>
              {renderHelpContent(HELP_TEXT, theme.text, theme.textSecondary)}
            </View>

            <View style={styles.tipsSection}>
              <ThemedText
                type="h4"
                style={[styles.tipsTitle, { color: theme.primary }]}
              >
                Tips
              </ThemedText>
              <View style={styles.tip}>
                <Feather name="compass" size={16} color={theme.primary} />
                <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                  Not sure where to go? Try typing "directions" for advice on your options.
                </ThemedText>
              </View>
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
  helpContent: {
    marginBottom: Spacing.xl,
  },
  sectionSpacer: {
    height: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  commandName: {
    fontWeight: "700",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.xs,
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
