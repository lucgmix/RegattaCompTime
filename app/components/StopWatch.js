import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { timeToString } from "../utils/phrf";

function StopWatch({ onElapsedChange }) {
  const [timerInterval, setTimerInterval] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");

  let startTime;
  let elapsedTime = 0;

  const handleStart = () => {
    startTime = Date.now() - elapsedTime;
    setTimerInterval(
      setInterval(function printTime() {
        elapsedTime = Date.now() - startTime + 3600000;
        onElapsedChange(elapsedTime);
        setTimeDisplay(timeToString(elapsedTime));
      }, 100)
    );
  };

  const handleStop = () => {
    clearInterval(timerInterval);
    setTimerInterval(0);
  };

  const handleReset = () => {
    clearInterval(timerInterval);
    setTimeDisplay("00:00:00");
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
          title="Start"
          onPress={handleStart}
        ></Button>
        <Button
          disabled={timerInterval === 0}
          buttonStyle={styles.button}
          title="Stop"
          onPress={handleStop}
        ></Button>
        <Button title="Reset" onPress={handleReset}></Button>
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
