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
      <Text style={[styles.name, isHeader && headerStyles.label]}>{name}</Text>
      <Text style={[styles.rating, isHeader && headerStyles.label]}>
        {rating}
      </Text>
      <Text style={[styles.time, isHeader && headerStyles.label]}>
        {correctedTime}
      </Text>
    </View>
  );
}

const seletedStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary500,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary,
  },
  label: {
    color: "white",
    fontWeight: "700",
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 0,
    flexDirection: "row",
    padding: 14,
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
