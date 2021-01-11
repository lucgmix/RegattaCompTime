import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import defaultStyles from "../../config/styles";

function ListItem({ name, rating, correctedTime, isSelectedItem, isHeader }) {
  return (
    <View
      style={[
        styles.container,
        isSelectedItem && seletedStyles.container,
        isHeader && headerStyles.container,
      ]}
    >
      <Text style={[styles.name, isHeader && headerStyles.name]}>{name}</Text>
      <Text style={[styles.rating, isHeader && headerStyles.name]}>
        {rating}
      </Text>
      <Text style={[styles.time, isHeader && headerStyles.time]}>
        {correctedTime}
      </Text>
    </View>
  );
}

const seletedStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.mediumlight,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.medium,
  },
  name: {
    color: "white",
  },
  rating: {
    color: "white",
  },
  time: {
    color: "white",
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 0,
    flexDirection: "row",
    padding: 15,
  },
  name: {
    flex: 0.4,
    flexDirection: "row",
  },
  rating: {
    flex: 0.2,
    flexDirection: "row",
    textAlign: "right",
  },
  time: {
    flex: 0.4,
    flexDirection: "row",
    textAlign: "right",
  },
});

export default ListItem;
