import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ITEMS } from "@/data/story";

export default function InventoryModal() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  // For now, display empty state - in a full implementation this would receive inventory via context or navigation params
  const inventory: string[] = [];

  const getItemIcon = (itemId: string): keyof typeof Feather.glyphMap => {
    switch (itemId) {
      case "lamp":
        return "sun";
      case "fuel":
        return "droplet";
      case "chalk":
        return "edit-3";
      case "rope":
        return "link";
      case "pickaxe":
        return "tool";
      default:
        return "box";
    }
  };

  if (inventory.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
          },
        ]}
      >
        <Image
          source={require("../../assets/images/empty-inventory.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <ThemedText type="h4" style={styles.emptyTitle}>
          Your pack is empty
        </ThemedText>
        <ThemedText
          style={[styles.emptyDescription, { color: theme.textSecondary }]}
        >
          Search your surroundings for useful items
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.grid}>
        {inventory.map((itemId) => {
          const item = ITEMS[itemId];
          if (!item) return null;

          return (
            <Card key={itemId} style={styles.itemCard} elevation={2}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.backgroundTertiary },
                ]}
              >
                <Feather
                  name={getItemIcon(itemId)}
                  size={28}
                  color={theme.primary}
                />
              </View>
              <ThemedText type="h4" style={styles.itemName}>
                {item.name}
              </ThemedText>
              <ThemedText
                style={[styles.itemDescription, { color: theme.textSecondary }]}
              >
                {item.description}
              </ThemedText>
              {item.usable ? (
                <View
                  style={[styles.usableBadge, { backgroundColor: theme.primaryDim }]}
                >
                  <ThemedText
                    style={[styles.usableText, { color: theme.primary }]}
                  >
                    Usable
                  </ThemedText>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
    opacity: 0.6,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    textAlign: "center",
  },
  grid: {
    gap: Spacing.md,
  },
  itemCard: {
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  itemName: {
    marginBottom: Spacing.xs,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  usableBadge: {
    alignSelf: "flex-start",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  usableText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
