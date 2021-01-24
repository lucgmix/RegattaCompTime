import React, { useMemo, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { PhrfProvider } from "./app/context/PhrfContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppLoading from "expo-app-loading";
import {
  FirebaseProvider,
  useFirebaseContext,
} from "./app/context/FirebaseContext";
//For full spash screen implementation,
//See https://medium.com/@darshancc23/how-to-add-a-splash-screen-on-react-native-and-expo-dddfd44772f3

export default function App() {
  const [isReady, setIsReady] = useState(false);
  //console.log(useFirebaseContext());
  //const { boatList } = useFirebaseContext();

  // if (!isReady) {
  //   return (
  //     <FirebaseProvider>
  //       <AppLoading
  //         startAsync={Promise.resolve(boatList)}
  //         onFinish={() => setIsReady(true)}
  //         onError={() => {
  //           console.log("on ERROR");
  //         }}
  //         autoHideSplash={true}
  //       />
  //     </FirebaseProvider>
  //   );
  // }

  return (
    <FirebaseProvider>
      <PhrfProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </PhrfProvider>
    </FirebaseProvider>
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
