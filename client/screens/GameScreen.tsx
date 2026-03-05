import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { MessageBubble } from "@/components/MessageBubble";
import { CommandInput } from "@/components/CommandInput";
import { GameHeader } from "@/components/GameHeader";
import { HelpModal } from "@/components/HelpModal";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/hooks/useGame";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Message } from "@/data/gameState";
import { SCENES } from "@/data/story";
import { trackRestartGame } from "@/analytics";

const AT_BOTTOM_THRESHOLD = 80;

export default function GameScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    gameState,
    messages,
    isLoading,
    gameOver,
    milestonesCompletedCount,
    parseCommand,
    handleNewGame,
    handlePromptResponse,
  } = useGame();

  const [helpVisible, setHelpVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [visibleSceneId, setVisibleSceneId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const userScrolledRef = useRef(false);

  const currentScene = SCENES[gameState.sceneId];
  const currentSceneTitle = currentScene?.title || "Unknown";
  const hasLamp = gameState.inventory.includes("lamp");

  const displayedSceneTitle = (() => {
    if (isAtBottom || !visibleSceneId) return currentSceneTitle;
    const scene = SCENES[visibleSceneId];
    return scene?.title || currentSceneTitle;
  })();

  useEffect(() => {
    if (messages.length > 0 && isAtBottom) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isAtBottom]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      const atBottom = distanceFromBottom <= AT_BOTTOM_THRESHOLD;
      setIsAtBottom(atBottom);

      if (!atBottom) {
        userScrolledRef.current = true;
      } else {
        userScrolledRef.current = false;
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const topItem = viewableItems[0]?.item as Message | undefined;
        if (topItem?.sceneId) {
          setVisibleSceneId(topItem.sceneId);
        }
      }
    }
  ).current;

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
    userScrolledRef.current = false;
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (!userScrolledRef.current) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, []);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble message={item} index={index} />
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const pendingPrompt = gameState.pendingPrompt;
  const isObituaryPrompt = pendingPrompt?.type === "obituary";

  const renderBottomBar = () => {
    const safeAreaBottom = Platform.OS === "web" ? 0 : insets.bottom;

    if (gameOver) {
      return (
        <View style={{ backgroundColor: theme.backgroundDefault }}>
          <View
            style={[
              styles.promptBar,
              {
                backgroundColor: theme.backgroundDefault,
                borderTopColor: theme.backgroundSecondary,
              },
            ]}
          >
            <Pressable
              onPress={() => { trackRestartGame(); handleNewGame(); }}
              style={[styles.promptButtonFull, { backgroundColor: theme.primary }]}
              testID="play-again-button"
            >
              <ThemedText style={[styles.promptButtonText, { color: theme.buttonText }]}>
                Play Again
              </ThemedText>
            </Pressable>
          </View>
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
      );
    }

    if (pendingPrompt) {
      const noLabel = isObituaryPrompt ? "Restart Story" : "No";
      const onNo = isObituaryPrompt
        ? () => { trackRestartGame(); handleNewGame(); }
        : () => handlePromptResponse(false);

      return (
        <View style={{ backgroundColor: theme.backgroundDefault }}>
          <View
            style={[
              styles.promptBar,
              {
                backgroundColor: theme.backgroundDefault,
                borderTopColor: theme.backgroundSecondary,
              },
            ]}
          >
            <View style={styles.promptButtonRow}>
              <Pressable
                onPress={() => handlePromptResponse(true)}
                style={[styles.promptButton, { backgroundColor: theme.primary }]}
                testID="prompt-yes"
              >
                <ThemedText style={[styles.promptButtonText, { color: theme.buttonText }]}>
                  Yes
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={onNo}
                style={[styles.promptButton, { backgroundColor: theme.backgroundTertiary }]}
                testID="prompt-no"
              >
                <ThemedText style={[styles.promptButtonText, { color: theme.text }]}>
                  {noLabel}
                </ThemedText>
              </Pressable>
            </View>
          </View>
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
      );
    }

    return (
      <CommandInput
        onSubmit={parseCommand}
        onHelp={() => setHelpVisible(true)}
        onRestart={handleNewGame}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <GameHeader
        lampLimit={gameState.lamp.limit}
        lampLit={gameState.lamp.lit}
        sceneTitle={displayedSceneTitle}
        hasLamp={hasLamp}
        milestonesCompleted={milestonesCompletedCount}
      />

      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === "web" ? undefined : "padding"}>
        <View style={styles.listWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />

          {!isAtBottom ? (
            <Pressable
              onPress={scrollToBottom}
              style={[
                styles.scrollToBottomButton,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.backgroundTertiary,
                },
              ]}
              testID="scroll-to-bottom"
            >
              <Feather name="chevron-down" size={20} color={theme.text} />
            </Pressable>
          ) : null}
        </View>

        {renderBottomBar()}
      </KeyboardAvoidingView>

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  listWrapper: {
    flex: 1,
    position: "relative",
  },
  messageList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  scrollToBottomButton: {
    position: "absolute",
    bottom: Spacing.md,
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  promptBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
  safeAreaBleed: {
    width: "100%",
  },
  promptButtonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  promptButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  promptButtonFull: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  promptButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
