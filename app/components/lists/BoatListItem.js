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
  ratingOverride,
  isSelectedItem,
  isHeader,
}) {
  return (
    <View
      style={[
        styles.container,
        isSelectedItem && seletedStyles.container,
        isHeader && headerStyles.header,
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
      <View
        style={[
          styles.selectedField,
          styles.rating((ratingOverride || defaultRating) === "FS", isHeader),
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            defaultStyles.text,
            styles.ratingText(
              (ratingOverride || defaultRating) === "FS",
              isHeader
            ),
            isHeader && headerStyles.label,
          ]}
        >
          {ratingFS}
        </Text>
      </View>
      <View
        style={[
          styles.selectedField,
          styles.rating((ratingOverride || defaultRating) === "NFS", isHeader),
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            defaultStyles.text,
            styles.ratingText(
              (ratingOverride || defaultRating) === "NFS",
              isHeader
            ),
            isHeader && headerStyles.label,
          ]}
        >
          {ratingNFS}
        </Text>
      </View>
    </View>
  );
}

const seletedStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary500,
  },
});

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: defaultStyles.colors.primary,
  },
  container(ratingOverride) {
    // console.log("ratingOverride !!!!!", ratingOverride);
    return {
      backgroundColor:
        ratingOverride === "FS" || ratingOverride === "NFS"
          ? defaultStyles.colors.primary300
          : defaultStyles.colors.primary,
    };
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
    minHeight: 50,
    alignItems: "center",
  },
  name: {
    marginLeft: 12,
    flex: 0.5,
    flexDirection: "row",
  },
  type: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "center",
  },
  rating(isDefaultRating, isHeader) {
    return {
      minHeight: 50,
      textAlign: "center",
      backgroundColor: isDefaultRating
        ? defaultStyles.colors.primary300
        : isHeader
        ? defaultStyles.colors.primary
        : defaultStyles.colors.transparent,
    };
  },
  ratingText(isDefaultRating) {
    return { fontSize: 15, fontWeight: isDefaultRating ? "700" : "400" };
  },
  default_rating: {
    textAlign: "right",
    fontSize: 15,
  },
  selectedField: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BoatListItem;
