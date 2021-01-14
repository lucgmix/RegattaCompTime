import React from "react";
import { Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";

function Race(props) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Race</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 28,
  },
  header: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 24,
  },
});

export default Race;
