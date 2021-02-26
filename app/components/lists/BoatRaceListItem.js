import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import Button from "../Button";
import defaultStyles from "../../config/styles";

function BoatRaceListItem({
  name,
  type,
  rating,
  correctedTime,
  isHeader,
  onFinishClick,
}) {
  return (
    <View style={[styles.container, isHeader && headerStyles.container]}>
      <View style={[styles.name, isHeader && headerStyles.nameContainer]}>
        <Text
          numberOfLines={1}
          style={[styles.name, isHeader && headerStyles.label]}
        >
          {name}
        </Text>
        {!isHeader && (
          <Text
            numberOfLines={1}
            style={[styles.type, isHeader && headerStyles.label]}
          >
            {type}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.correctedTime, isHeader && headerStyles.correctedTime]}
      >
        {correctedTime}
      </Text>
      {!isHeader && (
        <Button
          buttonStyle={styles.finishButton}
          onPress={onFinishClick}
          title="Finish"
        ></Button>
      )}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary,
  },
  nameContainer: { flex: 0.66 },
  label: {
    flex: 1,
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  correctedTime: {
    flex: 1,
    color: "white",
    fontSize: 14,
    alignSelf: "center",
  },
  name: {
    flex: 0.33,
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 0,
    flexDirection: "row",
    padding: 14,
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  type: {
    fontSize: 14,
  },
  correctedTime: {
    flex: 0.7,
    fontSize: 14,
    alignSelf: "center",
  },
  finishButton: {},
});

export default BoatRaceListItem;
