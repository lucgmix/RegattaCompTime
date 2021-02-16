import React from "react";
import { StyleSheet } from "react-native";

import Text from "../Text";

function ErrorMessage({ error, visible, style, ...otherProps }) {
  if (!visible || !error) return null;

  return (
    <Text {...otherProps} style={[styles.error, style]}>
      {error}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: { color: "red", fontSize: 12, marginLeft: 16 },
});

export default ErrorMessage;
