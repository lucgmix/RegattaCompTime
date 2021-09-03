import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../Text";
import Button from "../Button";
import defaultStyles from "../../config/styles";
import colors from "../../config/colors";

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
  boatType,
  rating,
  ratingError,
  correctedTime,
  elapsedTime,
  isHeader,
  onFinishClick,
  onEditClick,
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
        style={[
          defaultStyles.text,
          styles.rank,
          isHeader && headerStyles.label,
        ]}
      >
        {rank}
      </Text>
      <View
        style={[
          defaultStyles.text,
          styles.nameContainer,
          isHeader && headerStyles.nameContainer,
        ]}
      >
        <Text
          numberOfLines={2}
          style={[
            defaultStyles.text,
            styles.name,
            isHeader && headerStyles.label,
          ]}
        >
          {isHeader ? `${name}\n${boatType}/${rating}` : name}
        </Text>
        {!isHeader && (
          <Text
            numberOfLines={1}
            style={[
              defaultStyles.text,
              styles.type,
              isHeader && headerStyles.label,
            ]}
          >
            {`${boatType}/`}
            <Text style={styles.rating(ratingError)}>{rating}</Text>
          </Text>
        )}
      </View>
      <View
        style={[styles.timeContainer, isHeader && headerStyles.timeContainer]}
      >
        <Text
          numberOfLines={2}
          style={[
            defaultStyles.text,
            styles.correctedTime,
            isHeader && headerStyles.correctedTime,
          ]}
        >
          {isHeader ? `${correctedTime}\n${elapsedTime}` : correctedTime}
        </Text>
        {!isHeader && (
          <Text
            numberOfLines={1}
            style={[defaultStyles.text, styles.elapsedTime]}
          >
            {elapsedTime}
          </Text>
        )}
      </View>

      {(!isHeader && renderMode === RACE_ITEM_MODE.RACING) ||
      renderMode === RACE_ITEM_MODE.DEFAULT ||
      renderMode === RACE_ITEM_MODE.BOAT_FINISHED ? (
        <Button
          disabled={finishDisabled}
          buttonStyle={styles.finishButton}
          onPress={onFinishClick}
          title="Finish"
        ></Button>
      ) : (
        !isHeader &&
        (renderMode === RACE_ITEM_MODE.RACE_FINISHED ||
          RACE_ITEM_MODE.BOAT_DNF) && (
          <Button
            buttonStyle={styles.finishButton}
            onPress={onEditClick}
            title="Edit..."
          ></Button>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: (renderMode) => ({
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
  }),
  rank: {
    flex: 0.28,
    alignSelf: "center",
    fontWeight: "700",
  },
  nameContainer: { flex: 0.86 },
  name: {
    fontWeight: "700",
    flex: 1,
  },
  type: {
    fontSize: 13,
    color: colors.subText,
  },
  timeContainer: {
    flex: 0.58,
    justifyContent: "space-between",
  },
  rating(ratingError) {
    return {
      fontSize: 13,
      fontWeight: ratingError ? "700" : "400",
      color: ratingError
        ? defaultStyles.colors.darkRed
        : defaultStyles.colors.text,
    };
  },
  correctedTime: {
    fontWeight: "700",
  },
  elapsedTime: {
    color: colors.subText,
    letterSpacing: 1.9,
    fontSize: 13,
  },
  finishButton: {},
});

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    paddingRight: 80,
  },
  nameContainer: { flex: 0.9 },
  label: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  timeContainer: {
    flex: 0.6,
    alignItems: "flex-start",
  },
  correctedTime: {
    fontWeight: "600",
    color: colors.white,
    fontSize: 14,
  },
});

export default BoatRaceListItem;
