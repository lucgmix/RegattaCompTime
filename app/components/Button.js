import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

import defaultStyles from "../config/styles";

function AppButton({ title, onPress }) {
  return (
    <Button
      buttonStyle={styles.button}
      title={title}
      onPress={onPress}
      titleStyle={styles.text}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.primary,
    paddingLeft: 24,
    paddingRight: 24,
    marginLeft: 8,
    marginRight: 8,
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});

export default AppButton;
