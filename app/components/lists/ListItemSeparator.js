import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";

function ListItemSeparator(props) {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.mediumlight, height: 1 },
});

export default ListItemSeparator;
