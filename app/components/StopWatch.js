import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { timeToString } from "../utils/phrf";
import colors from "../config/colors";
import { Entypo } from "@expo/vector-icons";

let startTime = 0;
let elapsedTime = 0;
let startDT = 0;

function StopWatch({
  startLabel,
  stopLabel,
  resetLabel,
  onElapsedChange,
  // onStart,
  onStop,
  onReset,
  startTimeOffset,
  endRaceDisabled,
  resetRaceDisabled,
  start,
  stop,
  reset,
}) {
  const [timerInterval, setTimerInterval] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState(timeToString(startTimeOffset));

  startDT = elapsedTime === 0 ? startTimeOffset : 0;

  const handleStart = () => {
    startTime = Date.now() - elapsedTime - startDT;
    setTimerInterval(
      setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        onElapsedChange(elapsedTime);
        setTimeDisplay(timeToString(elapsedTime));
      }, 100)
    );
  };

  const handleStop = () => {
    clearInterval(timerInterval);
    setTimerInterval(0);
    startDT = 0;
    startTime = 0;
    elapsedTime = 0;
  };

  const handleReset = () => {
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    setTimeDisplay(timeToString(0));
  };

  useEffect(() => {
    if (start) {
      handleStart();
    }
  }, [start]);

  useEffect(() => {
    if (stop) {
      handleStop();
    }
  }, [stop]);

  useEffect(() => {
    if (reset) {
      handleReset();
    }
  }, [reset]);

  useEffect(() => {
    setTimeDisplay(timeToString(startTimeOffset));
  }, [startTimeOffset]);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Entypo name="stopwatch" size={24} color={colors.primary} />
        <Text style={styles.timeLabel}>{timeDisplay}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* <Button
          // disabled={timerInterval !== 0}
          buttonStyle={styles.button}
          title={startLabel}
          onPress={handleStart}
        ></Button> */}
        <Button
          disabled={endRaceDisabled}
          buttonStyle={styles.button}
          title={stopLabel}
          onPress={() => onStop()}
        ></Button>
        <Button
          disabled={resetRaceDisabled}
          title={resetLabel}
          onPress={() => onReset()}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "space-between",
  },
  button: { margin: 8 },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  timeContainer: { flexDirection: "row", margin: 8 },
  timeLabel: {
    fontSize: 16,
    marginLeft: 8,
    alignSelf: "center",
  },
});

export default StopWatch;
