import React from "react";
import { View, StyleSheet } from "react-native";
import color from "../config/colors";
import Text from "../components/Text";
import { RadioButton } from "react-native-paper";
import defaultStyles from "../config/styles";
import { PHRF_FORMULA } from "../screens/Settings";

function PhrfAlternateRadioGroup({ value, onUpdateSelection }) {
  return (
    <View style={styles.container}>
      <Text style={([defaultStyles.text], styles.title)}>PHRF-LO Formula</Text>
      <RadioButton.Group
        onValueChange={(value) => onUpdateSelection(value)}
        value={value}
        style={styles.radionGroup}
      >
        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value={PHRF_FORMULA.STANDARD}
              color={color.primary}
              styles={styles.radio}
            />
            <Text style={[defaultStyles.text, styles.radioText]}>Primary</Text>
          </View>
          <Text style={[defaultStyles.text, styles.radioDescription]}>
            Recommended formula designed to address the larger rating spread
            usually found in club events as well as the effects of diminishing
            wind due to sunset.
          </Text>
        </View>

        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value={PHRF_FORMULA.ALTERNATE}
              color={color.primary}
              styles={styles.radio}
            />
            <Text style={[defaultStyles.text, styles.radioText]}>
              Alternate
            </Text>
          </View>

          <Text style={[defaultStyles.text, styles.radioDescription]}>
            This alternate formula may be appropriate for use in Day Races and
            Interclub events. NOTE: When being used, this "Alternate" SHALL be
            stated in the Notice of Race and Sailing Instructions, in order to
            be valid.
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

export default PhrfAlternateRadioGroup;
