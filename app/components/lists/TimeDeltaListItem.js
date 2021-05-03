import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import defaultStyles from "../../config/styles";

function TimeDeltaListItem({
  boatName,
  boatType,
  rating,
  ratingError,
  correctedTime,
  isSelectedItem,
  isHeader,
}) {
  return (
    <View
      style={[
        defaultStyles.text,
        styles.container,
        isSelectedItem && seletedStyles.container,
        isHeader && headerStyles.container,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          defaultStyles.text,
          styles.name,
          isHeader && headerStyles.label,
        ]}
      >
        {boatName}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          defaultStyles.text,
          styles.type,
          isHeader && headerStyles.label,
        ]}
      >
        {boatType}
      </Text>
      <Text
        style={[
          defaultStyles.text,
          styles.rating(ratingError),
          isHeader && headerStyles.label,
        ]}
      >
        {rating}
      </Text>
      <Text
        style={[
          defaultStyles.text,
          styles.time,
          isHeader && headerStyles.label,
        ]}
      >
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
    flex: 0.5,
    flexDirection: "row",
  },
  type: {
    flex: 0.3,
    flexDirection: "row",
    fontSize: 14,
  },
  rating(ratingError) {
    return {
      flex: 0.25,
      flexDirection: "row",
      textAlign: "right",
      fontSize: 14,
      color: ratingError
        ? defaultStyles.colors.darkRed
        : defaultStyles.colors.text,
      fontWeight: ratingError ? "700" : "400",
    };
  },
  time: {
    flex: 0.4,
    flexDirection: "row",
    textAlign: "right",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default TimeDeltaListItem;
