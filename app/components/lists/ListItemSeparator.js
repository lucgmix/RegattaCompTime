import React from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import { Divider } from "react-native-elements";

function ListItemSeparator(props) {
  return <Divider style={styles.container} />;
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.gray, height: 1 },
});

export default ListItemSeparator;
