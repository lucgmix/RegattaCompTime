import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

import defaultStyles from "../config/styles";

function AppButton({ title, onPress, buttonStyle, ...otherProps }) {
  return (
    <Button
      buttonStyle={[styles.button, buttonStyle]}
      title={title}
      onPress={onPress}
      titleStyle={styles.text}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.primary,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});

export default AppButton;
