import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { SCENES } from "@/data/story";

interface MinimapProps {
  visitHistory: string[];
  currentSceneId: string;
  onScenePress?: (sceneId: string) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function Minimap({
  visitHistory,
  currentSceneId,
  onClose,
  showCloseButton = false,
}: MinimapProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault, borderRightColor: theme.border + "4D" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>Journey</Text>
        {showCloseButton && onClose ? (
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            testID="minimap-close"
          >
            <Feather name="x" size={24} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visitHistory.map((sceneId, index) => {
          const scene = SCENES[sceneId];
          const isCurrent = sceneId === currentSceneId;
          const isLast = index === visitHistory.length - 1;

          return (
            <View key={`${sceneId}-${index}`} style={styles.nodeContainer}>
              <View style={styles.lineContainer}>
                <View
                  style={[
                    styles.node,
                    {
                      backgroundColor: isCurrent ? theme.primary : theme.backgroundTertiary,
                      borderColor: isCurrent ? theme.primary : theme.border,
                    },
                  ]}
                >
                  {isCurrent ? (
                    <View style={[styles.nodeInner, { backgroundColor: theme.buttonText }]} />
                  ) : null}
                </View>
                {!isLast ? (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: theme.border },
                    ]}
                  />
                ) : null}
              </View>

              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.sceneTitle,
                    {
                      color: isCurrent ? theme.primary : theme.text,
                      fontWeight: isCurrent ? "600" : "400",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {scene?.title || sceneId}
                </Text>
                <Text
                  style={[styles.stepNumber, { color: theme.textSecondary }]}
                >
                  Step {index + 1}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h4,
    letterSpacing: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  nodeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  lineContainer: {
    alignItems: "center",
    width: 24,
  },
  node: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeInner: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  line: {
    width: 2,
    height: 32,
    marginTop: 2,
  },
  labelContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  sceneTitle: {
    ...Typography.body,
  },
  stepNumber: {
    ...Typography.small,
    marginTop: 2,
  },
});
