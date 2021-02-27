import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";

function padToTwo(number) {
  return number <= 9 ? `0${number}` : number;
}

function StopWatch(props) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [startTime, setStartTime] = useState(0);
  const [elaspedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(0);

  const handleStart = () => {
    setTimerInterval(setInterval(timer, 1000));
    console.log("handleStart intervalId", timerInterval);
  };

  const handleStop = () => {
    console.log("handleStop - intervalId", timerInterval);
    clearInterval(timerInterval);
  };

  const handleReset = () => {};

  const timer = () => {
    const now = new Date();
    setHour(now.getHours());
    setMinute(now.getMinutes());
    setSecond(now.getSeconds());
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>{padToTwo(hour)}:</Text>
        <Text style={styles.timeLabel}>{padToTwo(minute)}:</Text>
        <Text style={styles.timeLabel}>{padToTwo(second)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonsStyle={styles.button}
          title="Start"
          onPress={handleStart}
        ></Button>
        <Button
          buttonsStyle={styles.button}
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
