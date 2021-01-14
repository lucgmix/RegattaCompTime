import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress, color = "primary" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    paddingLeft: 24,
    paddingRight: 24,
    marginVertical: 2,
    marginLeft: 8,
    marginRight: 8,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "700",
  },
});

export default AppButton;
