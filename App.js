import React, { useMemo, useState, useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { PhrfProvider } from "./app/context/PhrfContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppLoading from "expo-app-loading";
import {
  StorageDataContext,
  useStorageContext,
} from "./app/context/StorageContext";
//For full spash screen implementation,
//See https://medium.com/@darshancc23/how-to-add-a-splash-screen-on-react-native-and-expo-dddfd44772f3

import { ModalProvider } from "./app/context/AppModalContext";

import { LogBox } from "react-native";
import _ from "lodash";

import storage from "./app/utils/storage";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // const clear = async () => {
  //   await storage.clearAll();
  // };

  // useEffect(() => {
  //   LogBox.ignoreWarnings(["Setting a timer"]);
  //   const _console = _.clone(console);
  //   console.warn = (message) => {
  //     if (message.indexOf("Setting a timer") <= -1) {
  //       _console.warn(message);
  //     }
  //   };
  // }, []);

  return (
    <StorageDataContext>
      <PhrfProvider>
        <NavigationContainer theme={navigationTheme}>
          <ModalProvider>
            <AppNavigator />
          </ModalProvider>
        </NavigationContainer>
      </PhrfProvider>
    </StorageDataContext>
  );
}
