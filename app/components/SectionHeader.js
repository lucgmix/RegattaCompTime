import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/Text";
import defaultStyles from "../config/styles";

function SectionHeader({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: defaultStyles.colors.primary,
  },
});

export default SectionHeader;
