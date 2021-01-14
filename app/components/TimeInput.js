import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Text from "./Text";

function TimeInput({ size }) {
  return (
    <View style={styles.container}>
      <TimeDigits timeUnit="hour" />
      <View>
        <Text style={digitStyles.colonSeparator}>:</Text>
        <View style={digitStyles.colonOffset} />
      </View>
      <TimeDigits timeUnit="minute" />
      <View>
        <Text style={digitStyles.colonSeparator}>:</Text>
        <View style={digitStyles.colonOffset} />
      </View>
      <TimeDigits timeUnit="second" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 24,
  },
});

export default TimeInput;

function TimeDigits({ size = 8, timeUnit, onChange }) {
  return (
    <View style={digitStyles.container}>
      <View style={digitStyles.inputContainer}>
        <View style={{ alignSelf: "center" }}>
          <TextInput
            caretHidden={false}
            style={digitStyles.textInputStyle}
            textAlign={"right"}
            placeholder="00"
            placeholderTextColor="#ccc"
            numeric
            keyboardType={"numeric"}
          />
        </View>
      </View>

      <Text style={digitStyles.timeUnits}>{timeUnit}</Text>
    </View>
  );
}

const digitStyles = StyleSheet.create({
  container: {},
  inputContainer: {
    flex: 1,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 64,
  },
  colonSeparator: {
    fontSize: 64,
  },
  timeUnits: {
    fontSize: 16,
    height: 24,
    textAlign: "center",
  },
  colonOffset: {
    height: 24,
  },
});
