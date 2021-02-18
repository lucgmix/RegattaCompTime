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

let listItemHeight = 0;

function TimeDelta(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const [raceDuration, setRaceDuration] = useState(3600);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const resultListRef = useRef();
  const { getBoatList, dataChanged } = useData();

  const { getElapsedDiff, secondsToHms, isAlternatePHRF } = usePHRF();

  const handleOnSelectedBoat = (item) => {
    updateBoatList(item);
  };

  const handleBoatItemClicked = (item) => {
    updateBoatList(item.boat);
  };

  const onRaceDurationChanged = (time) => {
    setRaceDuration(time);
  };

  const handleSetRaceDuration = () => {
    setIsTimeModalVisible(true);
  };

  const updateBoatList = (item) => {
    getBoatList().then(({ data }) => {
      setBoatResultsList(
        getElapsedDiff(data, item.rating, raceDuration, isAlternatePHRF)
      );
      const boatWithMatchingId = data.find((boat) => boat.id === item.id);
      setSelectedBoat(boatWithMatchingId);
    });
  };

  const selectBoatInList = () => {
    if (!selectedBoat) return;

    const indexOfSelectedBoatResult = boatResultsList.findIndex(
      (resultItem) => resultItem.boat.id === selectedBoat.id
    );

    resultListRef &&
      indexOfSelectedBoatResult > -1 &&
      resultListRef.current.scrollToIndex({
        animated: true,
        index: indexOfSelectedBoatResult,
      });
  };

  // Update dropdown otpions and viewBoatList when viewBoatList changes.
  useEffect(() => {
    getBoatList().then(({ data }) => {
      if (data) {
        const sortedBoats = Array.from(data);
        setBoatSelectList(
          sortedBoats.sort((a, b) => (a.boatName > b.boatName ? 1 : -1))
        );
      }
    });
  }, [dataChanged]);

  useEffect(() => {
    selectedBoat && updateBoatList(selectedBoat);
  }, [isAlternatePHRF, raceDuration, dataChanged]);

  // Scroll to selected boat result
  useEffect(() => {
    selectBoatInList();
  }, [selectedBoat, boatSelectList, dataChanged]);

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
        onContentSizeChange={selectBoatInList}
        ref={resultListRef}
        data={boatResultsList}
        getItemLayout={(_, index) => {
          return {
            length: listItemHeight,
            offset: listItemHeight * index,
            index,
          };
        }}
        keyExtractor={(resultItem) => {
          return resultItem.boat.id;
        }}
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
