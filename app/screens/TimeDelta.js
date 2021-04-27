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
import { applyBoldStyle } from "../utils/stringStyle";
import Button from "../components/Button";
import TimeDeltaListItem from "../components/lists/TimeDeltaListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import colors from "../config/colors";
import TimeInpuModal from "../components/TimeInputModal";
import DialogPrompt from "../components/DialogPrompt";

import { Entypo } from "@expo/vector-icons";
import SectionHeader from "../components/SectionHeader";
import defaultStyles from "../config/styles";
import { isEmpty } from "lodash";

let listItemHeight = 0;

function TimeDelta() {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const [raceDuration, setRaceDuration] = useState(3600);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);

  const resultListRef = useRef();
  const { getBoatList, boatDataChanged } = useStorage();

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

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const updateBoatList = (item) => {
    if (!item) return;

    getBoatList().then(({ boatData }) => {
      if (!isEmpty(boatData)) {
        const boatWithMatchingId = boatData.find((boat) => boat.id === item.id);

        if (boatWithMatchingId) {
          setBoatResultsList(
            getElapsedDiff(
              boatData,
              boatWithMatchingId.rating,
              raceDuration,
              isAlternatePHRF
            )
          );

          setSelectedBoat(boatWithMatchingId);
        }
      } else {
        setBoatResultsList([]);
        setSelectedBoat(null);
      }
    });
  };

  const selectBoatInList = (item) => {
    const selectedBoat = selectedBoat || item;
    if (!selectedBoat) return;

    getBoatList().then(({ boatData }) => {
      const indexOfSelectedBoatResult = boatData.findIndex(
        (resultItem) => resultItem.id === (selectedBoat.id || item.id)
      );

      resultListRef &&
        indexOfSelectedBoatResult > -1 &&
        resultListRef.current.scrollToIndex({
          animated: true,
          index: indexOfSelectedBoatResult,
        });
    });
  };

  const getTimeDeltaHelpString = (tag) => {
    let textToStyle;
    switch (tag) {
      case "message":
        textToStyle = {
          sentence: `The {0} section is were you can compare the time difference between boats based on the race duration and the boat's handicap.\n\nBoats above the selected reference boat (negative time values) owe you time.\n\nThe selected reference boat owes time to boats below it (positive time values)`,
          boldText: ["Time Delta"],
        };
        break;
      case "content":
        textToStyle = {
          sentence: `{0} button is used to enter the race duration of the reference boat and then choose the reference boat ({1}) to compare the time differences (Time Delta).\n\nTip: Select any boat in the list by clicking on it to change the reference boat.`,
          boldText: ["Set", "Select Reference Boat"],
        };
        break;
    }

    return applyBoldStyle(textToStyle);
  };

  // Update dropdown otpions and viewBoatList when viewBoatList changes.
  useEffect(() => {
    getBoatList().then(({ boatData }) => {
      if (boatData) {
        const sortedBoats = Array.from(boatData);
        setBoatSelectList(
          sortedBoats.sort((a, b) => (a.boatName > b.boatName ? 1 : -1))
        );
      }
    });
    return () => {
      setBoatSelectList([]);
    };
  }, [boatDataChanged]);

  useEffect(() => {
    updateBoatList(selectedBoat);
    return () => {
      setSelectedBoat(null);
      setBoatResultsList([]);
    };
  }, [isAlternatePHRF, raceDuration, boatDataChanged]);

  // Scroll to selected boat result
  useEffect(() => {
    selectBoatInList(selectedBoat);
  }, [selectedBoat, boatSelectList, boatDataChanged]);

  return (
    <Screen style={styles.container}>
      <DialogPrompt
        title="Time Delta Help"
        message={getTimeDeltaHelpString("message")}
        content={getTimeDeltaHelpString("content")}
        positive="Got it"
        isVisible={helpPromptVisible}
        onPositiveButtonPress={() => setHelpPromptVisible(false)}
      />
      <SectionHeader title="Time Delta" onHelpPress={handleHelpPress} />
      <View style={styles.timeInputContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo name="stopwatch" size={24} color={colors.primary} />
          <Text style={[defaultStyles.text, styles.timeDisplay]}>
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
        style={{ marginBottom: 10 }}
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
    marginBottom: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeDisplay: {
    color: colors.text,
    fontWeight: "400",
    marginLeft: 12,
    paddingTop: 2,
    alignItems: "center",
    fontSize: 16,
  },
  setTimeButton: {
    marginRight: 8,
  },
});

export default TimeDelta;
