import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import Screen from "../components/Screen";
import color from "../config/colors";
import Text from "../components/Text";

import PhrfContext from "../context/PhrfContext";

const PHRF_FORMULA = {
  STANDARD: "standard",
  ALTERNATE: "alternate",
};

function Settings(props) {
  const { isAlternatePHRF, setIsAlternatePHRF } = useContext(PhrfContext);
  const [value, setValue] = useState(
    isAlternatePHRF ? PHRF_FORMULA.ALTERNATE : PHRF_FORMULA.STANDARD
  );

  const updatePhrfFormula = (value) => {
    setValue(value);
    const isAlternate = value === PHRF_FORMULA.ALTERNATE;
    setIsAlternatePHRF(isAlternate);
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <Text>PHRF-LO Formula</Text>
      <RadioButton.Group
        onValueChange={(value) => updatePhrfFormula(value)}
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
            <Text style={styles.radioText}>Standard</Text>
          </View>
          <Text style={styles.radioDescription}>
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
            <Text style={styles.radioText}>Alternate</Text>
          </View>

          <Text style={styles.radioDescription}>
            This alternate formula may be appropriate for use in Day Races and
            Interclub events. NOTE: When being used, this "Alternate" SHALL be
            stated in the Notice of Race and Sailing Instructions, in order to
            be valid.
          </Text>
        </View>
      </RadioButton.Group>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  header: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 24,
  },
  radioText: {
    marginLeft: 20,
    fontSize: 14,
  },
  radioDescription: {
    marginLeft: 56,
    fontSize: 12,
  },
  radionGroup: {
    flex: 1,
  },
  radio: {
    alignSelf: "flex-start",
  },
});

export default Settings;
