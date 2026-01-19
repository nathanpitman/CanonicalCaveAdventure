import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GameScreen from "@/screens/GameScreen";
import InventoryModal from "@/screens/InventoryModal";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Game: undefined;
  Inventory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const opaqueScreenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inventory"
        component={InventoryModal}
        options={{
          ...opaqueScreenOptions,
          presentation: "modal",
          headerTitle: "Inventory",
        }}
      />
    </Stack.Navigator>
  );
}
