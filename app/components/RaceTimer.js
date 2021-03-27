import React, { useEffect, useState } from "react";
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
}) {
  const [date, setDate] = useState(startDate);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === "ios");
    setDate(currentDate);
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
    if (startDate) {
      setDate(startDate);
    }
  }, [startDate]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={colors.primary}
          />
          <Text
            style={styles.timeLabel}
          >{`${date
            .getHours()
            .toString()
            .padStart(2, "0")}h ${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}m ${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}s`}</Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}
        >
          <Button
            disabled={startTimeDisabled}
            buttonStyle={styles.button}
            title="Start Time..."
            onPress={handleShowTimepicker}
          />
          <Button
            disabled={startNowDisabled}
            title="Start Now"
            onPress={handleStartNow}
          />
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
    margin: 8,
  },
  timeLabel: {
    marginLeft: 6,
    fontSize: 16,
    alignSelf: "center",
  },
});

export default RaceTimer;
