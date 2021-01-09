import React from "react";
import { Text, View, StyleSheet } from "react-native";

function Race(props) {
  return (
    <View style={styles.container}>
      <Text>Race</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Race;
