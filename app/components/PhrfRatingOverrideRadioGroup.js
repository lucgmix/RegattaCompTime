import React from "react";
import { View, StyleSheet } from "react-native";
import color from "../config/colors";
import Text from "./Text";
import { RadioButton } from "react-native-paper";
import defaultStyles from "../config/styles";
import { RATING_OVERRIDE } from "../config/constants";

function PhrfRatingOverrideRadioGroup({ value, onUpdateSelection }) {
  return (
    <View style={styles.container}>
      <Text style={([defaultStyles.text], styles.title)}>
        PHRF Rating Override
      </Text>
      <RadioButton.Group
        onValueChange={(value) => onUpdateSelection(value)}
        value={value}
        style={styles.radionGroup}
      >
        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value={RATING_OVERRIDE.NONE}
              color={color.primary}
              styles={styles.radio}
            />
            <Text style={[defaultStyles.text, styles.radioText]}>
              Default Rating
            </Text>
          </View>
          <Text style={[defaultStyles.text, styles.radioDescription]}>
            Use the default rating set in each boat of the Fleet section.
          </Text>
        </View>

        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value={RATING_OVERRIDE.FS}
              color={color.primary}
              styles={styles.radio}
            />
            <Text style={[defaultStyles.text, styles.radioText]}>
              FS for all boats
            </Text>
          </View>

          <Text style={[defaultStyles.text, styles.radioDescription]}>
            Use the Flying Spinnaker rating for all boats. This overrides the
            boat's default rating.
          </Text>
        </View>

        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value={RATING_OVERRIDE.NFS}
              color={color.primary}
              styles={styles.radio}
            />
            <Text style={[defaultStyles.text, styles.radioText]}>
              NFS for all boats
            </Text>
          </View>

          <Text style={[defaultStyles.text, styles.radioDescription]}>
            Use the Non-Flying Spinnaker rating for all boats. This overrides
            the boat's default rating.
          </Text>
        </View>
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
    margin: 4,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: defaultStyles.colors.mediumlight,
    borderRadius: 8,
  },
  radioText: {
    marginLeft: 20,
    borderRadius: 8,
    padding: 8,
  },
  radioDescription: {
    marginLeft: 56,
    fontSize: 12,
    borderRadius: 8,
    padding: 8,
  },
  radionGroup: {
    flex: 1,
  },
  radio: {
    alignSelf: "flex-start",
  },
  title: {
    marginLeft: 4,
  },
});

export default PhrfRatingOverrideRadioGroup;
