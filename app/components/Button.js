import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

import defaultStyles from "../config/styles";

function AppButton({ title, type, onPress, buttonStyle, ...otherProps }) {
  const isClearButton = type === "clear";

  return (
    <Button
      buttonStyle={[
        styles.button,
        buttonStyle,
        isClearButton && styleClear.button,
      ]}
      title={title}
      onPress={onPress}
      titleStyle={styles.text}
      {...otherProps}
    />
  );
}

const styleClear = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.white,
  },
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.primary,
    paddingTop: 10,
    paddingBottom: 10,
    minWidth: 80,
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: 15,
    marginHorizontal: 6,
  },
});

export default AppButton;
