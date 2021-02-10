import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Picker from "../components/Picker";
import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";
import TimeDeltaListItem from "../components/lists/TimeDeltaListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { usePHRF } from "../context/PhrfContext";
import { useData } from "../context/DataContext";
import colors from "../config/colors";
import TimeInpuModal from "../components/TimeInputModal";

import { Entypo } from "@expo/vector-icons";
import SectionHeader from "../components/SectionHeader";
import { isEmpty } from "lodash";

let listItemHeight = 0;

function TimeDelta(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const [raceDuration, setRaceDuration] = useState(3600);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const resultListRef = useRef();
  const { boatList } = useData();

  const { getElapsedDiff, secondsToHms, isAlternatePHRF } = usePHRF();

  const handleOnSelectedBoat = (item) => {
    updateBoatList(item);
  };

  const handleBoatItemClicked = (item) => {
    updateBoatList(item.boat);
  };

  const updateBoatList = (item) => {
    setSelectedBoat(item);
    console.log("updateBoatList", boatResultsList);
    setBoatResultsList(
      getElapsedDiff(boatSelectList, item.rating, raceDuration, isAlternatePHRF)
    );
  };

  useEffect(() => {
    // console.log("******* TIMEDELATA useEffect selectedBoat", selectedBoat);
    // console.log("******* TIMEDELATA useEffect boatList", boatList);
    // console.log("******* TIMEDELATA useEffect raceDuration", raceDuration);
    selectedBoat && updateBoatList(selectedBoat);
  }, [isAlternatePHRF, raceDuration, boatList]);

  // Update dropdown otpions when boatList changes
  useEffect(() => {
    console.log("TIME DELTA", boatList);
    boatList && setBoatSelectList(boatList);
  }, [boatList]);

  //
  useEffect(() => {
    if (!selectedBoat) return;

    const indexOfSelectedBoat = boatResultsList.findIndex(
      (item) => item.boat.id === selectedBoat.id
    );

    resultListRef &&
      resultListRef.current.scrollToIndex({
        animated: true,
        index: indexOfSelectedBoat,
      });
  }, [selectedBoat, boatList]);

  const onRaceDurationChanged = (time) => {
    setRaceDuration(time);
  };

  const handleSetRaceDuration = () => {
    setIsTimeModalVisible(true);
  };

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Time Delta" />
      <View style={styles.timeInputContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo name="stopwatch" size={24} color={colors.primary} />
          <Text style={styles.timeDisplay}>
            {secondsToHms(raceDuration, false)}
          </Text>
        </View>
        <Button
          buttonStyle={styles.setTimeButton}
          title="Set"
          onPress={handleSetRaceDuration}
        ></Button>
      </View>
      <TimeInpuModal
        isModalVisible={isTimeModalVisible}
        duration={raceDuration}
        onDurationChange={onRaceDurationChanged}
        onModalButtonPress={() => setIsTimeModalVisible(false)}
        buttonLabel="Done"
      />

      <Picker
        icon="sail-boat"
        placeholder="Select Reference Boat"
        items={boatSelectList}
        selectedItem={selectedBoat}
        onSelectItem={handleOnSelectedBoat}
      />
      <FlatList
        ref={resultListRef}
        data={boatResultsList}
        getItemLayout={(_, index) => {
          return {
            length: listItemHeight,
            offset: listItemHeight * index,
            index,
          };
        }}
        keyExtractor={(resultItem) => resultItem.boat.id}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <TimeDeltaListItem
            boatName="Boat"
            rating="Rating"
            boatType="Type"
            correctedTime="Time Delta"
            isHeader
          />
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handleBoatItemClicked(item)}>
            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                listItemHeight = height;
              }}
            >
              <TimeDeltaListItem
                boatName={item.boat.boatName}
                rating={item.boat.rating}
                boatType={item.boat.boatType}
                correctedTime={secondsToHms(item.diff)}
                isSelectedItem={
                  selectedBoat && selectedBoat.id === item.boat.id
                }
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    backgroundColor: colors.light,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeDisplay: {
    color: colors.text,
    fontWeight: "400",
    marginLeft: 12,
    paddingTop: 2,
    alignItems: "center",
  },
  setTimeButton: {
    marginRight: 8,
  },
});

export default TimeDelta;
