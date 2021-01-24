import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { PhrfProvider } from "./app/context/PhrfContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppLoading from "expo-app-loading";
//For full spash screen implementation,
//See https://medium.com/@darshancc23/how-to-add-a-splash-screen-on-react-native-and-expo-dddfd44772f3

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const loadAppData = async () => {
    // const data = await remoteStorage.getdata();
    // setData();
    return Promise.resolve(console.log("loadAppData"));
  };

  // if (!isReady) {
  //   return (
  //     <AppLoading
  //       startAsync={loadAppData}
  //       onFinish={() => setIsReady(true)}
  //       onError={() => {
  //         console.log("on ERROR");
  //       }}
  //       autoHideSplash={true}
  //     />
  //   );
  // }

  return (
    <PhrfProvider>
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
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
