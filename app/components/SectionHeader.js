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
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "600",
    color: defaultStyles.colors.primary,
  },
});

export default SectionHeader;
