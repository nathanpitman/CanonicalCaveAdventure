import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MessageBubble } from "@/components/MessageBubble";
import { ActionButton } from "@/components/ActionButton";
import { CommandInput } from "@/components/CommandInput";
import { GameHeader } from "@/components/GameHeader";
import { GameOverModal } from "@/components/GameOverModal";
import { HelpModal } from "@/components/HelpModal";
import { Minimap } from "@/components/Minimap";
import { MinimapDrawer } from "@/components/MinimapDrawer";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/hooks/useGame";
import { Spacing } from "@/constants/theme";
import { Message } from "@/data/gameState";
import { Action } from "@/data/story";

const SIDEBAR_WIDTH = 260;

export default function GameScreen() {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {
    gameState,
    messages,
    isLoading,
    gameOver,
    getAvailableActions,
    handleAction,
    parseCommand,
    handleNewGame,
  } = useGame();

  const [helpVisible, setHelpVisible] = useState(false);
  const [minimapVisible, setMinimapVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const isLandscape = width > height && width >= 700;
  const actions = getAvailableActions();

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

  const gameContent = (
    <View style={styles.gameArea}>
      <GameHeader
        light={gameState.stats.light}
        onMinimapPress={() => setMinimapVisible(true)}
        showMinimapButton={!isLandscape}
      />

      <KeyboardAvoidingView style={styles.content} behavior="padding">
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

        {actions.length > 0 ? (
          <View style={styles.actionsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionsScroll}
            >
              {actions.map((action: Action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onPress={handleAction}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <CommandInput
          onSubmit={parseCommand}
          onHelp={() => setHelpVisible(true)}
          onRestart={handleNewGame}
        />
      </KeyboardAvoidingView>

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />

      {gameOver ? (
        <GameOverModal
          visible={true}
          type={gameOver}
          onNewGame={handleNewGame}
        />
      ) : null}
    </View>
  );

  if (isLandscape) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.landscapeLayout}>
          <View
            style={[
              styles.sidebar,
              { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
          >
            <Minimap
              visitHistory={gameState.visitHistory || ["chasm_base"]}
              currentSceneId={gameState.sceneId}
            />
          </View>
          {gameContent}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {gameContent}

      <MinimapDrawer
        visible={minimapVisible}
        visitHistory={gameState.visitHistory || ["chasm_base"]}
        currentSceneId={gameState.sceneId}
        onClose={() => setMinimapVisible(false)}
      />
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
  landscapeLayout: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: "#1A1612",
  },
  gameArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  messageList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  actionsContainer: {
    paddingVertical: Spacing.sm,
  },
  actionsScroll: {
    paddingHorizontal: Spacing.lg,
  },
});
