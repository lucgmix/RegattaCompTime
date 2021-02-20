import React from "react";
import { StyleSheet } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";

function Race(props) {
  return (
    <Screen style={styles.container}>
      <SectionHeader title="Race" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
  },
});

export default Race;
