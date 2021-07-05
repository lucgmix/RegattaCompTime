import React, { useState } from "react";

import { PhrfProvider } from "./app/context/PhrfContext";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import { StorageDataContext } from "./app/context/StorageContext";
//For full spash screen implementation,
//See https://medium.com/@darshancc23/how-to-add-a-splash-screen-on-react-native-and-expo-dddfd44772f3

import { ModalProvider } from "./app/context/AppModalContext";
import _ from "lodash";

export default function App() {
  const [isReady, setIsReady] = useState(false);

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
