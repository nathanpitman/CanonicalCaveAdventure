import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ROOT_BG = "#0A0A0A";

export default function App() {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.backgroundColor = ROOT_BG;

      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = ROOT_BG;

      const ensureMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!tag) {
          tag = document.createElement("meta");
          tag.name = name;
          document.head.appendChild(tag);
        }
        tag.content = content;
      };
      ensureMeta("apple-mobile-web-app-capable", "yes");
      ensureMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    }
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <NavigationContainer>
              <RootStackNavigator />
            </NavigationContainer>
            <StatusBar style="light" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ROOT_BG,
  },
});
