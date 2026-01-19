import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { MessageBubble } from "@/components/MessageBubble";
import { ActionButton } from "@/components/ActionButton";
import { CommandInput } from "@/components/CommandInput";
import { GameHeader } from "@/components/GameHeader";
import { GameMenu } from "@/components/GameMenu";
import { GameOverModal } from "@/components/GameOverModal";
import { HelpModal } from "@/components/HelpModal";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/hooks/useGame";
import { Spacing } from "@/constants/theme";
import { Message } from "@/data/gameState";
import { Action } from "@/data/story";

export default function GameScreen() {
  const { theme } = useTheme();
  const {
    gameState,
    messages,
    isLoading,
    gameOver,
    getAvailableActions,
    handleAction,
    parseCommand,
    handleSave,
    handleLoad,
    handleNewGame,
  } = useGame();

  const [menuVisible, setMenuVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const actions = getAvailableActions();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleMenuNewGame = () => {
    setMenuVisible(false);
    handleNewGame();
  };

  const handleMenuSave = () => {
    setMenuVisible(false);
    handleSave();
  };

  const handleMenuLoad = () => {
    setMenuVisible(false);
    handleLoad();
  };

  const handleMenuHelp = () => {
    setMenuVisible(false);
    setTimeout(() => setHelpVisible(true), 300);
  };

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

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <GameHeader
        light={gameState.stats.light}
        onMenuPress={() => setMenuVisible(true)}
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

        <CommandInput onSubmit={parseCommand} />
      </KeyboardAvoidingView>

      <GameMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNewGame={handleMenuNewGame}
        onSave={handleMenuSave}
        onLoad={handleMenuLoad}
        onHelp={handleMenuHelp}
      />

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
  actionsContainer: {
    paddingVertical: Spacing.sm,
  },
  actionsScroll: {
    paddingHorizontal: Spacing.lg,
  },
});
