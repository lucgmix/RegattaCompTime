import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { timeToString } from "../utils/phrf";
import colors from "../config/colors";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";

let startTime = 0;
let elapsedTime = 0;
let startDT = 0;

export const STOPWATCH_STATE = {
  STARTED: "started",
  STOPPED: "stopped",
  RESET: "reset",
};

function StopWatch({
  startLabel,
  stopLabel,
  resetLabel,
  onElapsedChange,
  onStop,
  onReset,
  startTimeOffset,
  endRaceDisabled,
  resetRaceDisabled,
  state,
  date,
}) {
  const [timerInterval, setTimerInterval] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState(timeToString(startTimeOffset));
  const [currentDate, setCurrentDate] = useState(date);
  const [status, setStatus] = useState("Waiting for Start");

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
    switch (state) {
      case STOPWATCH_STATE.STARTED:
        handleStart();
        break;
      case STOPWATCH_STATE.STOPPED:
        handleStop();
        break;
      case STOPWATCH_STATE.RESET:
        handleReset();
    }
  }, [state]);

  useEffect(() => {
    if (startTimeOffset) {
      setTimeDisplay(timeToString(startTimeOffset));
    }
  }, [startTimeOffset]);

  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  useEffect(() => {
    if (state) {
      switch (state) {
        case STOPWATCH_STATE.STARTED:
          setStatus("Racing");
          break;
        case STOPWATCH_STATE.STOPPED:
          setStatus("Race Stopped");
          break;
        case STOPWATCH_STATE.RESET:
          setStatus("Waiting for Start");
      }
    }
  }, [state]);

  return (
    <View style={styles.container}>
      <View style={styles.stopWatchContainer}>
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
            buttonStyle={styles.stopButton}
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
      <View style={styles.statusBar(state)}>
        <Text style={styles.statusBarText}>{status}</Text>
        {state === STOPWATCH_STATE.RESET && (
          <Text style={styles.statusBarDateText}>
            {format(currentDate, "iiii h:mm:ss a")}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
  },
  stopWatchContainer: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.white,
    backgroundColor: colors.light,
    justifyContent: "space-between",
  },
  button: { margin: 8 },
  stopButton: {
    margin: 8,
    backgroundColor: colors.darkRed,
  },
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
  statusBar(state) {
    let statusColor = "orange";
    if (state) {
      switch (state) {
        case STOPWATCH_STATE.STARTED:
          statusColor = colors.darkGreen;
          break;
        case STOPWATCH_STATE.STOPPED:
          statusColor = colors.darkRed;
          break;
        case STOPWATCH_STATE.RESET:
          statusColor = colors.orange;
      }
    }
    return {
      marginTop: 8,
      padding: 12,
      alignItems: "center",
      backgroundColor: statusColor,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.white,
    };
  },
  statusBarText: { color: "white", fontWeight: "900", fontSize: 20 },
  statusBarDateText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },
});

export default StopWatch;
