import React, { useMemo, useState, useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { PhrfProvider } from "./app/context/PhrfContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppLoading from "expo-app-loading";
import { DataProvider, useDataContext } from "./app/context/DataContext";
import { getBoatList } from "./app/api/FirebaseApi";
//For full spash screen implementation,
//See https://medium.com/@darshancc23/how-to-add-a-splash-screen-on-react-native-and-expo-dddfd44772f3

import storage from "./app/utils/storage";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // if (!isReady) {
  //   return (
  //     <FirebaseProvider>
  //       <AppLoading
  //         startAsync={getBoatList}
  //         onFinish={() => setIsReady(true)}
  //         onError={(error) => {
  //         }}
  //         autoHideSplash={true}
  //       />
  //     </FirebaseProvider>
  //   );
  // }

  // const clear = async () => {
  //   await storage.clearAll();
  // };

  // useEffect(() => {
  //   clear();
  // }, []);

  return (
    <DataProvider>
      <PhrfProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </PhrfProvider>
    </DataProvider>
  );
}
