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
import HelpDialogPrompt from "../components/HelpDialogPrompt";

import { Entypo } from "@expo/vector-icons";
import SectionHeader from "../components/SectionHeader";
import defaultStyles from "../config/styles";
import { RATING_OVERRIDE } from "../config/constants";
import { isEmpty } from "lodash";

let listItemHeight = 0;

function TimeDelta() {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const [raceDuration, setRaceDuration] = useState(3600);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const resultListRef = useRef();
  const { getBoatList, boatDataChanged, formulaABChanged } = useStorage();

  const {
    getElapsedDiff,
    getTimeDeltaCorrectedTime,
    secondsToHms,
    isAlternatePHRF,
    deviceCanEmail,
    sendEmail,
  } = usePHRF();

  const handleEmailPress = () => {
    sendEmail(`RegattaCompTime - Time Delta`, buildEmailContent());
  };

  const buildEmailContent = () => {
    let contentText = ``;
    const boatWithMatchingId = boatResultsList.find((resultItem) => {
      return resultItem.boat.id === (selectedBoat && selectedBoat.id);
    });

    const timeDiffList = getElapsedDiff(
      boatSelectList,
      boatWithMatchingId.boat.rating,
      raceDuration,
      isAlternatePHRF
    );

    contentText += `Duration: ${secondsToHms(raceDuration)}\n\n`;

    timeDiffList.map((result, index) => {
      const isReferenceBoat = result.boat.id === boatWithMatchingId.boat.id;
      const referenceLabel = isReferenceBoat ? " (Reference Boat)" : "";
      const defaultRating = `${
        result.boat.useNFSRating ? result.boat.ratingNFS : result.boat.ratingFS
      } (${
        result.boat.useNFSRating ? RATING_OVERRIDE.NFS : RATING_OVERRIDE.FS
      })`;

      const ratingOverride = result.boat.ratingOverride;
      const ratingOverrideValue =
        !isEmpty(ratingOverride) && ratingOverride === RATING_OVERRIDE.FS
          ? `${result.boat.ratingFS} (FS)`
          : !isEmpty(ratingOverride)
          ? `${result.boat.ratingNFS} (NFS)`
          : "";

      contentText += `${index + 1} ${
        result.boat.boatName
      }${referenceLabel}\n   Class: ${result.boat.boatType}\n   Rating: ${
        ratingOverrideValue || defaultRating
      }\n   Time Delta: ${secondsToHms(result.diff)}`;

      contentText += `\n\n`;
    });
    return contentText;
  };

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
          getTimeDeltaCorrectedTime();

          setBoatResultsList(
            getElapsedDiff(
              boatData,
              boatWithMatchingId.rating,
              raceDuration,
              isAlternatePHRF
            )
          );

          setSelectedBoat(boatWithMatchingId);
          setEmailEnabled(true);
        }
      } else {
        setBoatResultsList([]);
        setSelectedBoat(null);
        setEmailEnabled(false);
      }
    });
  };

  const selectBoatInList = (item) => {
    if (!item) return;
    const indexOfSelectedBoatResult = boatResultsList.findIndex(
      (resultItem) => resultItem.boat.id === item.id
    );

    resultListRef &&
      indexOfSelectedBoatResult > -1 &&
      resultListRef.current.scrollToIndex({
        animated: true,
        index: indexOfSelectedBoatResult,
      });
  };

  const getTimeDeltaHelpString = (tag) => {
    let textToStyle;
    switch (tag) {
      case "message":
        textToStyle = {
          sentence: `The {0} section is were you can compare the time difference between boats based on the race duration of the reference boat (typically your own boat) and the boat's handicap.\n\nBoats above the selected reference boat (negative time values) owe you time.\n\nThe selected reference boat owes time to boats below it (positive time values).`,
          boldText: ["Time Delta"],
        };
        break;
      case "content":
        textToStyle = {
          sentence: `{0} Allows to enter the race duration of the reference boat.\n\n{1} Click and choose the reference boat, typically your own boat, to compare the time differences (Time Delta).\n\nTip: Select any boat in the list by clicking on it to change the reference boat.`,
          boldText: ["Set Duration...", "Select Reference Boat"],
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
  }, [isAlternatePHRF, raceDuration, boatDataChanged, formulaABChanged]);

  // Scroll to selected boat result
  useEffect(() => {
    selectBoatInList(selectedBoat);
  }, [selectedBoat, boatSelectList, boatDataChanged, formulaABChanged]);

  return (
    <Screen style={styles.container}>
      <HelpDialogPrompt
        title="Time Delta Help"
        message={getTimeDeltaHelpString("message")}
        content={getTimeDeltaHelpString("content")}
        positive="Got it"
        isVisible={helpPromptVisible}
        onPositiveButtonPress={() => setHelpPromptVisible(false)}
      />
      <SectionHeader
        title="Time Delta"
        onHelpPress={handleHelpPress}
        onEmailPress={handleEmailPress}
        emailVisible={deviceCanEmail}
        emailEnabled={emailEnabled}
      />
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
          title="Set Duration..."
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
        onContentSizeChange={() => selectBoatInList(selectedBoat)}
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
            boatType="Class"
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
                ratingError={item.boat.ratingError}
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
    minWidth: 80,
  },
});

export default TimeDelta;
