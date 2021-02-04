import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import defaultStyles from "../../config/styles";

function BoatListItem({
  name,
  type,
  rating_fs,
  rating_nfs,
  isSelectedItem,
  isHeader,
}) {
  return (
    <View
      style={[
        styles.container,
        isSelectedItem && seletedStyles.container,
        isHeader && headerStyles.container,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.name, isHeader && headerStyles.label]}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.type, isHeader && headerStyles.label]}
      >
        {type}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.rating_fs, isHeader && headerStyles.label]}
      >
        {rating_fs}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.rating_nfs, isHeader && headerStyles.label]}
      >
        {rating_nfs}
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
    fontWeight: "600",
    fontSize: 16,
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
    fontSize: 14,
  },
  type: {
    flex: 0.25,
    flexDirection: "row",
    fontSize: 14,
  },
  rating_fs: {
    flex: 0.3,
    flexDirection: "row",
    textAlign: "right",
    fontSize: 14,
  },
  rating_nfs: {
    flex: 0.3,
    flexDirection: "row",
    textAlign: "right",
    fontSize: 14,
  },
});

export default BoatListItem;
