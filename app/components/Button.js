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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    minWidth: 80,
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: 16,
  },
});

export default AppButton;
