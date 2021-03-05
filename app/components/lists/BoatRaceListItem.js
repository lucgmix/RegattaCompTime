import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import Button from "../Button";
import defaultStyles from "../../config/styles";

export const RACE_ITEM_MODE = {
  DEFAULT: "default",
  RACING: "racing",
  BOAT_FINISHED: "boat_finished",
  RACE_FINISHED: "race_finished",
  BOAT_DNF: "boat_did_not_finish",
};

function BoatRaceListItem({
  rank = "-",
  name,
  type,
  correctedTime,
  isHeader,
  onFinishClick,
  renderMode,
}) {
  const finishDisabled =
    renderMode === RACE_ITEM_MODE.DEFAULT ||
    renderMode === RACE_ITEM_MODE.BOAT_FINISHED ||
    renderMode === RACE_ITEM_MODE.RACE_FINISHED ||
    renderMode === RACE_ITEM_MODE.BOAT_DNF;

  return (
    <View
      style={[styles.container(renderMode), isHeader && headerStyles.container]}
    >
      <Text
        numberOfLines={1}
        style={[styles.rank, isHeader && headerStyles.label]}
      >
        {rank}
      </Text>
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
          disabled={finishDisabled}
          buttonStyle={styles.finishButton}
          onPress={onFinishClick}
          title="Finish"
        ></Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: function (renderMode) {
    return {
      backgroundColor:
        renderMode === RACE_ITEM_MODE.DEFAULT
          ? defaultStyles.colors.light
          : renderMode === RACE_ITEM_MODE.BOAT_FINISHED ||
            renderMode === RACE_ITEM_MODE.RACE_FINISHED
          ? defaultStyles.colors.green
          : defaultStyles.colors.light,
      borderRadius: 0,
      flexDirection: "row",
      padding: 12,
      justifyContent: "space-between",
    };
  },
  rank: {
    flex: 0.33,
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  name: {
    fontWeight: "600",
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

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
  },
  nameContainer: { flex: 0.66 },
  label: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  correctedTime: {
    flex: 1.1,
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    alignSelf: "center",
  },
  rank: {
    fontSize: 14,
  },
  name: {
    fontSize: 14,
  },
});

export default BoatRaceListItem;
