import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { formatDate, millisecondsToDuration } from "../utils/phrf";
import colors from "../config/colors";
import { Entypo } from "@expo/vector-icons";

let startTime = 0;
let elapsedTime = 0;
let startDT = 0;

export const STOPWATCH_STATE = {
  STARTED: "started",
  STOPPED: "stopped",
  RESET: "reset",
};

function StopWatch({
  stopLabel,
  resetLabel,
  onElapsedChange,
  onStop,
  onReset,
  onStartToday,
  startTimeOffset,
  endRaceDisabled,
  resetRaceDisabled,
  state,
  date,
}) {
  const [timerInterval, setTimerInterval] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState(
    millisecondsToDuration(startTimeOffset)
  );
  const [currentDate, setCurrentDate] = useState(date);
  const [status, setStatus] = useState();

  startDT = elapsedTime === 0 ? startTimeOffset : 0;

  const handleStart = () => {
    startTime = Date.now() - elapsedTime - startDT;
    setTimerInterval(
      setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        onElapsedChange(elapsedTime);
        setTimeDisplay(millisecondsToDuration(elapsedTime));
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
    setTimeDisplay(millisecondsToDuration(0));
  };

  const isCurrentDateInThePast = () => {
    if (currentDate) {
      const today = new Date();
      return currentDate.getTime() < today.getTime();
    } else {
      return false;
    }
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
      setTimeDisplay(millisecondsToDuration(startTimeOffset));
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
          setStatus("Race Finished");
          break;
        case STOPWATCH_STATE.RESET:
          setStatus("Waiting for Start");
      }
    }
  }, [state]);

  const raceTime = () => {
    return formatDate(currentDate, currentDate.getSeconds() !== 0, true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.stopWatchContainer}>
        <View style={styles.timeContainer}>
          <Entypo name="stopwatch" size={24} color={colors.primary} />
          <Text style={styles.timeLabel}>{timeDisplay}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            disabled={endRaceDisabled}
            buttonStyle={styles.stopButton}
            title={stopLabel}
            onPress={() => onStop()}
          />
          <Button
            disabled={resetRaceDisabled}
            title={resetLabel}
            onPress={() => onReset()}
          />
        </View>
      </View>
      {state && (
        <View style={styles.statusBar(state)}>
          <View>
            <Text style={styles.statusBarText}>{status}</Text>
            {state === STOPWATCH_STATE.RESET && !isCurrentDateInThePast() && (
              <Text style={styles.statusBarDateText}>{`at ${raceTime()}`}</Text>
            )}

            {state === STOPWATCH_STATE.RESET && isCurrentDateInThePast() && (
              <View>
                <Text
                  style={styles.statusBarDateText}
                >{`at next ${raceTime()}`}</Text>
                <Button
                  buttonStyle={styles.statusbarButton}
                  title={`Start Today's Race`}
                  onPress={() => onStartToday()}
                />
              </View>
            )}
          </View>
        </View>
      )}
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
          statusColor = colors.mediumGreen;
          break;
        case STOPWATCH_STATE.STOPPED:
          statusColor = colors.darkRed;
          break;
        case STOPWATCH_STATE.RESET:
          statusColor = colors.orange;
      }
    }
    return {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8,
      padding: 12,
      backgroundColor: statusColor,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.white,
    };
  },
  statusBarText: { color: "white", fontWeight: "900", fontSize: 20 },
  statusBarDateText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 15,
  },
  statusbarButton: {
    marginTop: 4,
    backgroundColor: colors.darkGreen,
  },
});

export default StopWatch;
