import React, { useEffect } from "react";
import { StyleSheet, Platform, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Colors } from "@/constants/theme";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme ?? "dark"];

  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.backgroundColor = theme.backgroundRoot;
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";

      const ensureMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!tag) {
          tag = document.createElement("meta");
          tag.name = name;
          document.head.appendChild(tag);
        }
        tag.content = content;
      };
      ensureMeta("theme-color", theme.backgroundRoot);
      ensureMeta("apple-mobile-web-app-capable", "yes");
      ensureMeta("apple-mobile-web-app-status-bar-style", "black-translucent");

      const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (viewportMeta) {
        const current = viewportMeta.content;
        if (!current.includes("viewport-fit=cover")) {
          viewportMeta.content = current + ", viewport-fit=cover";
        }
      }
    }
  }, [isDark, theme.backgroundRoot]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
          <KeyboardProvider>
            <NavigationContainer>
              <RootStackNavigator />
            </NavigationContainer>
            <StatusBar style={isDark ? "light" : "dark"} />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
