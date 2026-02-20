import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const flatListRef = useRef<FlatList>(null);

  const currentScene = SCENES[gameState.sceneId];
  const sceneTitle = currentScene?.title || "Unknown";
  const hasLamp = gameState.inventory.includes("lamp");

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

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
    if (gameOver) {
      return (
        <View
          style={[
            styles.promptBar,
            {
              backgroundColor: theme.backgroundDefault,
              borderTopColor: theme.backgroundSecondary,
              paddingBottom: Math.max(insets.bottom, 8),
            },
            Platform.OS === "web" && {
              paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))` as any,
            },
          ]}
        >
          <Pressable
            onPress={handleNewGame}
            style={[styles.promptButtonFull, { backgroundColor: theme.primary }]}
            testID="play-again-button"
          >
            <ThemedText style={[styles.promptButtonText, { color: theme.buttonText }]}>
              Play Again
            </ThemedText>
          </Pressable>
        </View>
      );
    }

    if (pendingPrompt) {
      const noLabel = isObituaryPrompt ? "Restart Story" : "No";
      const onNo = isObituaryPrompt
        ? () => handleNewGame()
        : () => handlePromptResponse(false);

      return (
        <View
          style={[
            styles.promptBar,
            {
              backgroundColor: theme.backgroundDefault,
              borderTopColor: theme.backgroundSecondary,
              paddingBottom: Math.max(insets.bottom, 8),
            },
            Platform.OS === "web" && {
              paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))` as any,
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
        sceneTitle={sceneTitle}
        hasLamp={hasLamp}
        milestonesCompleted={milestonesCompletedCount}
      />

      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === "web" ? undefined : "padding"}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

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
  messageList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  promptBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
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
