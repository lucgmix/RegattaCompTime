import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeDelta from "../screens/TimeDelta";
import Race from "../screens/Race";
import Settings from "../screens/Settings";
import Fleet from "../screens/Fleet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";

//Icons https://icons.expo.fyi/
import { Entypo, Feather } from "@expo/vector-icons";

const SECTIONS = {
  RACE: { name: "race", title: "Race" },
  TIMEDELTA: { name: "timedelta", title: "Time Delta" },
  FLEET: { name: "fleet", title: "Fleet" },
  SETTINGS: { name: "settings", title: "Settings" },
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { storeValueForKey, getValueForKey } = useStorage();
  const { setIsAlternatePHRF } = usePHRF();

  const saveCurrentScreen = (screenName) => {
    storeValueForKey("@current_screen", screenName);
  };

  useEffect(() => {
    getValueForKey("@phrf_formula").then((result) => {
      setIsAlternatePHRF(result.data);
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={SECTIONS.FLEET.name}
      navigation={{ type: "NAVIGATE", target: "settings" }}
      tabBarOptions={{
        showLabel: true,
        showIcon: true,
        labelStyle: {
          fontWeight: "600",
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen
        name={SECTIONS.FLEET.name}
        component={Fleet}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="sail-boat"
              size={size}
              color={color}
            />
          ),
          title: SECTIONS.FLEET.title,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            saveCurrentScreen(route.name);
          },
        })}
      />
      <Tab.Screen
        name={SECTIONS.RACE.name}
        component={Race}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="flag" size={size} color={color} />
          ),
          title: SECTIONS.RACE.title,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            saveCurrentScreen(route.name);
          },
        })}
      />
      <Tab.Screen
        name={SECTIONS.TIMEDELTA.name}
        component={TimeDelta}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="stopwatch" size={size} color={color} />
          ),
          title: SECTIONS.TIMEDELTA.title,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            saveCurrentScreen(route.name);
          },
        })}
      />

      <Tab.Screen
        name={SECTIONS.SETTINGS.name}
        component={Settings}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name={"settings"} size={size} color={color} />
          ),
          title: SECTIONS.SETTINGS.title,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            saveCurrentScreen(route.name);
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
