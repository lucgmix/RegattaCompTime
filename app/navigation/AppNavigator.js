import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeDelta from "../screens/TimeDelta";
import Race from "../screens/Race";
import Settings from "../screens/Settings";
import BoatCreator from "../screens/BoatCreator";
import Fleet from "../screens/Fleet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Icons https://icons.expo.fyi/
import { Entypo, Feather } from "@expo/vector-icons";
import TabBarButton from "./TabBarButton";

const SECTIONS = {
  RACE: { name: "race", title: "Race" },
  TIMEDELTA: { name: "timedelta", title: "Time Delta" },
  FLEET: { name: "fleet", title: "Fleet" },
  SETTINGS: { name: "settings", title: "Settings" },
};

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={SECTIONS.FLEET.name}
      tabBarOptions={{
        showLabel: true,
        showIcon: true,
        labelStyle: {
          fontWeight: "600",
          fontSize: 12,
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
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
