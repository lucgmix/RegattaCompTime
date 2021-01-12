import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import Screen from "../components/Screen";
import color from "../config/colors";
import Text from "../components/Text";

function Settings(props) {
  const [value, setValue] = useState("first");

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <Text>PHRF-LO Formula</Text>
      <RadioButton.Group
        onValueChange={(value) => setValue(value)}
        value={value}
        style={styles.radionGroup}
      >
        <View>
          <View style={styles.radioButton}>
            <RadioButton
              value="standard"
              color={color.primary}
              checked
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
              value="alternate"
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
    paddingTop: 28,
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
