import React from "react";
import { StyleSheet, View } from "react-native";

import Text from "../Text";

function ErrorMessage({ error, visible, style, ...otherProps }) {
  return (
    <View style={styles.container}>
      {visible && (
        <Text {...otherProps} style={[styles.error, style]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 16,
  },
});

export default ErrorMessage;
