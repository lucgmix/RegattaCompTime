import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import defaultStyles from "../../config/styles";

function BoatListItem({
  name,
  type,
  ratingFS,
  ratingNFS,
  defaultRating,
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
        style={[
          defaultStyles.text,
          styles.name,
          isHeader && headerStyles.label,
        ]}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          defaultStyles.text,
          styles.type,
          isHeader && headerStyles.label,
        ]}
      >
        {type}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          defaultStyles.text,
          styles.rating(defaultRating === "FS"),
          isHeader && headerStyles.label,
        ]}
      >
        {ratingFS}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          defaultStyles.text,
          styles.rating(defaultRating === "NFS"),
          isHeader && headerStyles.label,
        ]}
      >
        {ratingNFS}
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
    fontSize: 15,
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
    flex: 0.33,
    flexDirection: "row",
    justifyContent: "center",
  },
  rating(isDefaultRating) {
    return {
      flex: 0.3,
      flexDirection: "row",
      textAlign: "right",
      fontSize: 15,
      fontWeight: isDefaultRating ? "700" : "400",
    };
  },
  default_rating: {
    flex: 0.3,
    flexDirection: "row",
    textAlign: "right",
    fontSize: 15,
  },
});

export default BoatListItem;
