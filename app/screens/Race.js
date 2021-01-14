import React from "react";
import { Text, View, StyleSheet } from "react-native";
import TimeInput from "../components/TimeInput";
import Screen from "../components/Screen";

function Race(props) {
  return (
    <Screen style={styles.container}>
      {/* <Text>Race</Text> */}
      <TimeInput />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 28,
  },
});

export default Race;
