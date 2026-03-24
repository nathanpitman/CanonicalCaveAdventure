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
  Keyboard,
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

const AT_BOTTOM_THRESHOLD = 150;

export default function GameScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    gameState,
    messages,
    isLoading,
    isResumedGame,
    gameOver,
    milestonesCompletedCount,
    parseCommand,
    handleNewGame,
    handlePromptResponse,
  } = useGame();

  const [helpVisible, setHelpVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [visibleSceneId, setVisibleSceneId] = useState<string | null>(null);
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [pendingNavHintIds, setPendingNavHintIds] = useState<Set<string>>(new Set());
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const typingQueueRef = useRef<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const userScrolledRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMessageCountRef = useRef(0);
  const seenMessageIdsRef = useRef<Set<string>>(new Set());
  const hasSeededAfterLoadRef = useRef(false);

  const currentScene = SCENES[gameState.sceneId];
  const currentSceneTitle = currentScene?.title || "Unknown";
  const hasLamp = gameState.inventory.includes("lamp");

  const displayedSceneTitle = (() => {
    if (isAtBottom || !visibleSceneId) return currentSceneTitle;
    const scene = SCENES[visibleSceneId];
    return scene?.title || currentSceneTitle;
  })();

  const performAutoScroll = useCallback((animated = true) => {
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
    isAutoScrollingRef.current = true;
    flatListRef.current?.scrollToEnd({ animated });
    if (!animated) {
      autoScrollTimerRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 50);
    }
  }, []);

  const handleScrollBeginDrag = useCallback(() => {
    userScrolledRef.current = true;
  }, []);

  const handleScrollEnd = useCallback(() => {
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (messages.length === 0) {
      typingQueueRef.current = [];
      seenMessageIdsRef.current = new Set();
      setActiveTypingId(null);
      setRevealedIds(new Set());
      setPendingNavHintIds(new Set());
      setPendingCommand(null);
      return;
    }

    if (!hasSeededAfterLoadRef.current) {
      hasSeededAfterLoadRef.current = true;
      if (isResumedGame) {
        const seededRevealedIds = new Set<string>();
        messages.forEach((m) => {
          seenMessageIdsRef.current.add(m.id);
          seededRevealedIds.add(m.id);
        });
        setRevealedIds(seededRevealedIds);
        return;
      }
    }

    const newTypewritableIds: string[] = [];
    const newNavHintIds: string[] = [];
    for (const msg of messages) {
      if (!seenMessageIdsRef.current.has(msg.id)) {
        seenMessageIdsRef.current.add(msg.id);
        if (msg.type !== "action" && msg.type !== "nav-hint") {
          newTypewritableIds.push(msg.id);
        } else if (msg.type === "nav-hint") {
          newNavHintIds.push(msg.id);
        }
      }
    }

    if (newTypewritableIds.length > 0) {
      typingQueueRef.current.push(...newTypewritableIds);
      if (newNavHintIds.length > 0) {
        setPendingNavHintIds((prev) => {
          const next = new Set(prev);
          newNavHintIds.forEach((id) => next.add(id));
          return next;
        });
      }
      setActiveTypingId((prev) => {
        if (prev !== null) return prev;
        return typingQueueRef.current.shift()!;
      });
    }
  }, [messages, isLoading, isResumedGame]);

  useEffect(() => {
    if (activeTypingId === null && pendingCommand !== null) {
      parseCommand(pendingCommand);
      setPendingCommand(null);
    }
  }, [activeTypingId, pendingCommand, parseCommand]);

  useEffect(() => {
    if (activeTypingId === null) {
      setPendingNavHintIds((prev) => (prev.size > 0 ? new Set() : prev));
    }
  }, [activeTypingId]);

  useEffect(() => {
    if (activeTypingId === null || userScrolledRef.current) return;
    const interval = setInterval(() => {
      if (!userScrolledRef.current) {
        flatListRef.current?.scrollToEnd({ animated: false });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [activeTypingId]);

  useEffect(() => {
    const count = messages.length;
    if (count > prevMessageCountRef.current && count > 0) {
      if (!userScrolledRef.current) {
        setTimeout(() => performAutoScroll(true), 100);
      }
    }
    prevMessageCountRef.current = count;
  }, [messages.length, performAutoScroll]);

  useEffect(() => {
    const event = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const sub = Keyboard.addListener(event, () => {
      if (!userScrolledRef.current && !isAutoScrollingRef.current) {
        setTimeout(() => performAutoScroll(true), 150);
      }
    });
    return () => sub.remove();
  }, [performAutoScroll]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      const atBottom = distanceFromBottom <= AT_BOTTOM_THRESHOLD;
      setIsAtBottom(atBottom);

      if (isAutoScrollingRef.current) return;

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
        const bottomItem = viewableItems[viewableItems.length - 1]?.item as Message | undefined;
        if (bottomItem?.sceneId) {
          setVisibleSceneId(bottomItem.sceneId);
        }
      }
    }
  ).current;

  const scrollToBottom = useCallback(() => {
    userScrolledRef.current = false;
    setIsAtBottom(true);
    performAutoScroll(true);
  }, [performAutoScroll]);

  const contentHeightRef = useRef(0);

  const handleContentSizeChange = useCallback((w: number, h: number) => {
    const prevHeight = contentHeightRef.current;
    contentHeightRef.current = h;
    if (h > prevHeight && !userScrolledRef.current && !isAutoScrollingRef.current) {
      performAutoScroll(true);
    }
  }, [performAutoScroll]);

  const handleTypingComplete = useCallback((completedId: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(completedId);
      return next;
    });
    setActiveTypingId((prev) => {
      if (prev !== completedId) return prev;
      if (typingQueueRef.current.length > 0) {
        return typingQueueRef.current.shift()!;
      }
      return null;
    });
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isNew = item.id === activeTypingId;
      const isAction = item.type === "action";
      const isNavHint = item.type === "nav-hint";
      const isPendingReveal =
        (!isAction && !isNavHint && !isNew && !revealedIds.has(item.id)) ||
        (isNavHint && pendingNavHintIds.has(item.id));
      const msgId = item.id;
      return (
        <MessageBubble
          key={isPendingReveal ? `${item.id}-p` : item.id}
          message={item}
          isNew={isNew}
          isPendingReveal={isPendingReveal}
          onTypingComplete={isNew ? () => handleTypingComplete(msgId) : undefined}
        />
      );
    },
    [activeTypingId, revealedIds, pendingNavHintIds, handleTypingComplete]
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

    const handleCommandSubmit = (cmd: string) => {
      if (activeTypingId !== null) {
        setPendingCommand(cmd);
      } else {
        parseCommand(cmd);
      }
    };

    return (
      <CommandInput
        onSubmit={handleCommandSubmit}
        onHelp={() => setHelpVisible(true)}
        onRestart={handleNewGame}
        isPending={pendingCommand !== null}
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
            onScrollBeginDrag={handleScrollBeginDrag}
            onContentSizeChange={handleContentSizeChange}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={false}
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
