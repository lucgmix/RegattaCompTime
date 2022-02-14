import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";
import defaultStyles from "../config/styles";

import Constants from "expo-constants";

function About() {
  return (
    <View style={styles.container}>
      <Text style={([defaultStyles.text], styles.title)}>About</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Name: {Constants.manifest.name}</Text>
        {/* <Text style={styles.text}>
          App Version: {Constants.manifest.version}
        </Text> */}
        <Text style={styles.text}>App Version: Beta 14</Text>
        <Text style={styles.text}>
          SDK Version: {Constants.manifest.sdkVersion}
        </Text>
        <Text style={styles.text}>App icon: Suzanne Roy</Text>
        <Text style={styles.text}>Concept/UX feedback: Simon Grégoire</Text>

        <Text style={styles.text}>Developed by Luc Grégoire</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
    margin: 4,
  },
  title: {
    marginLeft: 4,
  },
  textContainer: {
    backgroundColor: defaultStyles.colors.mediumlight,
    marginTop: 8,
    marginLeft: 48,
    marginRight: 4,
    padding: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default About;
