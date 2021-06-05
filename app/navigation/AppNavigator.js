import React, { useEffect, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeDelta from "../screens/TimeDelta";
import Race from "../screens/Race";
import Settings from "../screens/Settings";
import Fleet from "../screens/Fleet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import { CURRENT_SCREEN_KEY, WELCOME_SCREEN_KEY } from "../config/constants";

//Icons https://icons.expo.fyi/
import { Entypo, Feather } from "@expo/vector-icons";
import { ModalContext } from "../context/AppModalContext";

const SECTIONS = {
  RACE: { name: "race", title: "Race" },
  TIMEDELTA: { name: "timedelta", title: "Time Delta" },
  FLEET: { name: "fleet", title: "Fleet" },
  SETTINGS: { name: "settings", title: "Settings" },
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {
    getPHRFIsAlternateFormula,
    getRatingOverride,
    storeValueForKey,
    getValueForKey,
  } = useStorage();
  const { setIsAlternatePHRF, setRatingOverride } = usePHRF();
  const { showAppModal } = useContext(ModalContext);

  const saveCurrentScreen = (screenName) => {
    storeValueForKey(CURRENT_SCREEN_KEY, screenName);
  };

  useEffect(() => {
    getPHRFIsAlternateFormula().then((result) => {
      if (result.ok) {
        setIsAlternatePHRF(result.data);
      }
    });

    getRatingOverride().then((result) => {
      if (result.ok) {
        setRatingOverride(result.data);
      }
    });

    getValueForKey(WELCOME_SCREEN_KEY).then((response) => {
      if (response.ok && response.data) {
        showAppModal(!response.data);
      } else {
        showAppModal(true);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={SECTIONS.FLEET.name}
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
