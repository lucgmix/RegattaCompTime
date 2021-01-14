import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ComparePHRF from "../screens/ComparePHRF";
import Race from "../screens/Race";
import Settings from "../screens/Settings";

//Icons https://icons.expo.fyi/
import { Entypo, Feather } from "@expo/vector-icons";
import TabBarButton from "./TabBarButton";

const SECTIONS = {
  RACE: { name: "race", title: "Race" },
  TIMEDELTA: { name: "timedelta", title: "Time Delta" },
  SETTINGS: { name: "settings", title: "Settings" },
};

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={SECTIONS.TIMEDELTA.name}
      tabBarOptions={{ showLabel: true, showIcon: true, fontSize: 24 }}
    >
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
        name={SECTIONS.TIMEDELTA.name}
        component={ComparePHRF}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="stopwatch" size={size} color={color} />
          ),
          title: SECTIONS.TIMEDELTA.title,
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
