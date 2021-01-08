import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import defaultStyles from "../../config/styles";

function ListItem({ name, rating, correctedTime, isSelectedItem }) {
  return (
    <View style={[styles.container, isSelectedItem && seletedStyles.container]}>
      <Text style={styles.name}>
        {name} ({rating})
      </Text>
      {/* <Text style={styles.rating}>({rating}</Text> */}
      <Text style={styles.time}>{correctedTime}</Text>
    </View>
  );
}

const seletedStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.mediumlight,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 0,
    flexDirection: "row",
    padding: 15,
    marginVertical: 1,
    justifyContent: "space-between",
  },
  separator: {
    borderBottomColor: defaultStyles.colors.dark,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  time: {},
  rating: {
    minWidth: 30,
  },
});

export default ListItem;
