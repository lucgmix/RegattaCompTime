import React from "react";
import { StyleSheet } from "react-native";
import ComparePHRF from "./app/screens/ComparePHRF";
import Race from "./app/screens/Race";
import Settings from "./app/screens/Settings";
import { PhrfProvider } from "./app/context/PhrfContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Time Diffs" component={ComparePHRF} />
      <Tab.Screen name="Race" component={Race} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <PhrfProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </PhrfProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
