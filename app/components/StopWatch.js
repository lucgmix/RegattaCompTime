import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { timeToString } from "../utils/phrf";

let startTime = 0;
let elapsedTime = 0;
let startDT = 0;

function StopWatch({
  startLabel,
  stopLabel,
  resetLabel,
  onElapsedChange,
  onStart,
  onStop,
  onReset,
  startTimeOffset,
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
    onStart();
  };

  const handleStop = () => {
    clearInterval(timerInterval);
    setTimerInterval(0);
    startDT = 0;
    onStop();
  };

  const handleReset = () => {
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    setTimeDisplay(timeToString(startTimeOffset));
    onReset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>{timeDisplay}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={timerInterval !== 0}
          buttonStyle={styles.button}
          title={startLabel}
          onPress={handleStart}
        ></Button>
        <Button
          disabled={timerInterval === 0}
          buttonStyle={styles.button}
          title={stopLabel}
          onPress={handleStop}
        ></Button>
        <Button
          disabled={timerInterval !== 0}
          title={resetLabel}
          onPress={handleReset}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  button: { marginRight: 8 },
  buttonContainer: {
    flexDirection: "row",
  },
  timeContainer: { flexDirection: "row", margin: 8 },
  timeLabel: { fontSize: 24 },
});

export default StopWatch;
