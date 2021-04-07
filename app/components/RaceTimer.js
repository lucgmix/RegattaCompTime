import React, { useCallback, useMemo, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/Text";
import Button from "../components/Button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function RaceTimer({
  onTimeChange,
  onStartNow,
  startTimeDisabled,
  startNowDisabled,
  startDate,
  editMode = false,
}) {
  const [date, setDate] = useState(startDate);
  const [show, setShow] = useState(false);

  const getTimeString = useCallback(
    (raceDateTime) => {
      const hours = raceDateTime.getHours();
      const minutes = raceDateTime.getMinutes();
      const seconds = raceDateTime.getSeconds();

      const hourString = `${hours.toString()}`;
      const minuteString = `:${minutes.toString().padStart(2, "0")}`;
      const secondsString = `:${seconds.toString().padStart(2, "0")}`;

      let timeString = hourString;

      if (hours >= 13) {
        timeString = `${(hours - 12).toString()}`;
      } else if (hours === 0) {
        timeString = `12`;
      }

      const timeSuffix = hours >= 12 ? "PM" : "AM";
      timeString += minuteString;

      if (seconds > 0) {
        timeString += secondsString;
      }
      return `${timeString} ${timeSuffix}`;
    },
    [date]
  );

  const onChange = (event, selectedDate) => {
    // setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleShowTimepicker = () => {
    setShow(true);
  };

  const handleHideTimePicker = () => {
    setShow(false);
  };

  const handleTimePicker = (date) => {
    setDate(date);
    setShow(false);
    onTimeChange(date);
  };

  const handleStartNow = () => {
    const nowDate = new Date();
    setDate(nowDate);
    onStartNow(nowDate);
  };

  useEffect(() => {
    if (date) {
      setDate(startDate);
    }
  }, [date, startDate]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.timeLabel}>{getTimeString(date)}</Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}
        >
          <Button
            disabled={startTimeDisabled}
            buttonStyle={styles.button}
            title={editMode ? "Edit Start Time..." : "Start Time..."}
            onPress={handleShowTimepicker}
          />
          {!editMode && (
            <Button
              buttonStyle={styles.button}
              disabled={startNowDisabled}
              title="Start Now"
              onPress={handleStartNow}
            />
          )}
        </View>
      </View>
      {show && (
        <DateTimePickerModal
          isVisible={show}
          date={date}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChange}
          onConfirm={handleTimePicker}
          onCancel={handleHideTimePicker}
          headerTextIOS="Set Race Starting Time"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  controls: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    backgroundColor: colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  timeLabel: {
    marginLeft: 6,
    fontSize: 16,
    alignSelf: "center",
  },
});

export default RaceTimer;
