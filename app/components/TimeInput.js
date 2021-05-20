import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import Text from "./Text";
import defaultStyles from "../config/styles";

function getHour(time) {
  return Math.floor(time / 60 / 60);
}

function getMinute(time) {
  return Math.floor(time / 60) - getHour(time) * 60;
}

function getSecond(time) {
  return time % 60;
}

function TimeInput({ duration, onDurationChange }) {
  const [hour, setHour] = useState(Number(getHour(duration)));
  const [minute, setMinute] = useState(Number(getMinute(duration)));
  const [second, setSecond] = useState(Math.round(Number(getSecond(duration))));

  useEffect(() => {
    const duration = Math.round(
      hour * 60 * 60 + minute * 60 + Math.round(Number(second))
    );
    onDurationChange(duration);
  }, [hour, minute, second]);

  const onHourDigitsChanged = (time) => {
    setHour(time);
  };

  const onMinuteDigitsChanged = (time) => {
    setMinute(time);
  };

  const onSecondDigitsChanged = (time) => {
    setSecond(time);
  };

  return (
    <View style={styles.container}>
      <TimeDigits
        timeValue={hour}
        timeUnit="hour"
        onChange={onHourDigitsChanged}
      />
      <View>
        <Text style={digitStyles.colonSeparator}>:</Text>
        <View style={digitStyles.colonOffset} />
      </View>
      <TimeDigits
        timeValue={minute.toString().padStart(2, "0")}
        timeUnit="minute"
        onChange={onMinuteDigitsChanged}
      />
      <View>
        <Text style={digitStyles.colonSeparator}>:</Text>
        <View style={digitStyles.colonOffset} />
      </View>
      <TimeDigits
        timeValue={second.toString().padStart(2, "0")}
        timeUnit="second"
        onChange={onSecondDigitsChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 24,
  },
});

export default TimeInput;

function TimeDigits({ timeValue, timeUnit, size = 8, onChange }) {
  const [timeDigits, setTimeDigits] = useState(timeValue);

  const handleOnTextChange = (time) => {
    setTimeDigits(time);
    onChange(time);
  };

  const padSingleDigit = () => {
    if (timeUnit !== "hour") {
      setTimeDigits(timeDigits.toString().padStart(2, "0"));
    }
  };

  return (
    <View style={digitStyles.container}>
      <View style={digitStyles.inputContainer}>
        <View style={{ alignSelf: "center" }}>
          <TextInput
            value={timeDigits.toString()}
            caretHidden={false}
            style={digitStyles.textInputStyle}
            textAlign={"right"}
            placeholder="00"
            placeholderTextColor={defaultStyles.colors.grey}
            numeric
            keyboardType={"numeric"}
            maxLength={2}
            onChangeText={(text) => handleOnTextChange(text)}
            selectTextOnFocus={true}
            contextMenuHidden={true}
            selectionColor={defaultStyles.colors.primary500}
            onBlur={padSingleDigit}
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
    color: defaultStyles.colors.text,
  },
  colonSeparator: {
    fontSize: 64,
    color: defaultStyles.colors.medium,
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
