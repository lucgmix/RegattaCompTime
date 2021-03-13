import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import BoatRaceListItem, {
  RACE_ITEM_MODE,
} from "../components/lists/BoatRaceListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import {
  Entypo,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import StopWatch from "../components/StopWatch";
import DialogPrompt from "../components/DialogPrompt";
import { isEmpty } from "lodash";

const RACE_STATE = {
  NOT_STARTED: "not_started",
  STARTED_AND_RUNNING: "started",
  FINISHED: "race_finished",
  RESET_CLEARED: "reset",
};

function ratingSortResults(resultList) {
  if (isEmpty(resultList)) return;
  return Array.from(resultList).sort((a, b) => {
    if (a.boat.rating === b.boat.rating) {
      return a.boat.boatName > b.boat.boatName ? 1 : -1;
    } else {
      return a.boat.rating > b.boat.rating ? 1 : -1;
    }
  });
}

function correctTimeSortResults(
  resultList,
  elapsedTime,
  isAlternatePHRF,
  getCorrectedTime
) {
  if (isEmpty(resultList)) return;
  return Array.from(resultList).sort((a, b) => {
    const boatACorrectedTime =
      a.correctedTime ||
      getCorrectedTime(elapsedTime, a.boat.rating, isAlternatePHRF);
    const boatBCorrectedTime =
      b.correctedTime ||
      getCorrectedTime(elapsedTime, b.boat.rating, isAlternatePHRF);
    return boatACorrectedTime > boatBCorrectedTime ? 1 : -1;
  });
}

const elapsedOffset = 3600000;

function Race(props) {
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [viewBoatResultList, setViewBoatResultList] = useState([]);
  const [clearRacePromptVisible, setClearRacePromptVisible] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(elapsedOffset);
  const [raceState, setRaceState] = useState(RACE_STATE.NOT_STARTED);
  const { getBoatList, dataChanged } = useStorage();

  const { getCorrectedTime, isAlternatePHRF, timeToString } = usePHRF();

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const populateResultList = () => {
    getBoatList().then(({ data }) => {
      const resultList = data.map((boat) => {
        return { boat, rank: "-", elapsedTime: 0, correctedTime: 0 };
      });
      setViewBoatResultList(ratingSortResults(resultList));
    });
  };

  const updateResultList = () => {
    if (isEmpty(viewBoatResultList)) return;

    getBoatList().then(({ data }) => {
      // Iterate fleet boat list
      const updatedBoatResultList = data.map((boat) => {
        // Find a result for the current boat
        const resultOfBoat = Array.from(viewBoatResultList).find(
          (result) => result.boat.id === boat.id
        );
        // We have a result so we update the boat and the results data.
        if (resultOfBoat) {
          const newResult = {
            ...resultOfBoat,
            boat: boat,
            correctedTime: getCorrectedTime(
              resultOfBoat.elapsedTime,
              boat.rating,
              isAlternatePHRF
            ),
          };

          return newResult;
        } else {
          // Boat was not in results so we create the result object
          return {
            boat: boat,
            rank: "-",
            elapsedTime: 0,
            correctedTime: 0,
          };
        }
      });

      if (
        raceState === RACE_STATE.STARTED_AND_RUNNING ||
        raceState === RACE_STATE.FINISHED
      ) {
        setViewBoatResultList(
          correctTimeSortResults(
            getUpdatedResultRanking(updatedBoatResultList),
            elapsedTime,
            isAlternatePHRF,
            getCorrectedTime
          )
        );
      } else {
      }
    });
  };

  const getBoatCorrectedTime = (result, elapsed) => {
    return timeToString(
      getCorrectedTime(
        result.elapsedTime || elapsed,
        result.boat.rating,
        isAlternatePHRF
      )
    );
  };

  const getBoatElapsedTime = (result, elapsed) => {
    return result.elapsedTime > 0
      ? timeToString(result.elapsedTime)
      : timeToString(elapsed);
  };

  const getUpdatedResultRanking = (resultList) => {
    if (isEmpty(resultList)) return;

    if (
      raceState === RACE_STATE.STARTED_AND_RUNNING ||
      raceState === RACE_STATE.FINISHED
    ) {
      const updatedCorrectedTime = Array.from(resultList).map((result) => {
        result.correctedTime = getCorrectedTime(
          result.elapsedTime,
          result.boat.rating,
          isAlternatePHRF
        );

        return result;
      });

      const sortedCorrectedTime = updatedCorrectedTime.sort((a, b) => {
        return a.correctedTime > b.correctedTime ? 1 : -1;
      });

      const finishedBoatResults = sortedCorrectedTime.filter((result) => {
        return result.elapsedTime > 0;
      });

      for (let i = 0; i < finishedBoatResults.length; i++) {
        finishedBoatResults[i].rank = i + 1;
      }
      return updatedCorrectedTime;
    } else {
      return resultList;
    }
  };

  const handleElapsedChange = (elapsed) => {
    setElapsedTime(elapsed);
  };

  const handleBoatFinishClick = (result) => {
    const resultCopy = { ...result };
    resultCopy.elapsedTime = elapsedTime;
    resultCopy.correctedTime = getCorrectedTime(
      elapsedTime,
      resultCopy.boat.rating,
      isAlternatePHRF
    );

    const allBoats = Array.from(viewBoatResultList);
    const originalResultIndex = allBoats.findIndex(
      (result) => result.boat.id === resultCopy.boat.id
    );
    allBoats[originalResultIndex] = resultCopy;

    const finishedBoatResults = Array.from(allBoats).filter((result) => {
      return result.elapsedTime > 0;
    });
    finishedBoatResults.sort((a, b) => {
      return a.correctedTime > b.correctedTime ? 1 : -1;
    });
    for (let i = 0; i < finishedBoatResults.length; i++) {
      finishedBoatResults[i].rank = i + 1;
    }

    setViewBoatResultList(allBoats);
  };

  const handleOnStopRace = () => {
    setRaceState(RACE_STATE.FINISHED);
    const resultList = Array.from(viewBoatResultList);
    const hasAtLeastOneFinish = Array.from(viewBoatResultList).filter(
      (result) => result.rank > 0
    );

    if (hasAtLeastOneFinish.length === 0) return;

    const sortedArray = correctTimeSortResults(
      resultList,
      elapsedTime,
      isAlternatePHRF,
      getCorrectedTime
    );
    setViewBoatResultList(sortedArray);
  };

  const handleClearRace = () => {
    setClearRacePromptVisible(false);
    setRaceState(RACE_STATE.RESET_CLEARED);
    const resetBoatResults = Array.from(viewBoatResultList).map((result) => {
      result.elapsedTime = 0;
      result.correctedTime = 0;
      result.rank = "-";
      return result;
    });
    setViewBoatResultList(ratingSortResults(resetBoatResults));
    setElapsedTime(elapsedOffset);
  };

  const handleOnStartRace = () => {
    setRaceState(RACE_STATE.STARTED_AND_RUNNING);
  };

  const handleReset = () => {
    setClearRacePromptVisible(true);
  };

  const getRenderMode = (result) => {
    // Boat finished and race is still running
    if (
      result.elapsedTime !== 0 &&
      raceState === RACE_STATE.STARTED_AND_RUNNING
    ) {
      return RACE_ITEM_MODE.BOAT_FINISHED;
    }
    //  Boat finished and race is finished
    else if (result.elapsedTime !== 0 && raceState === RACE_STATE.FINISHED) {
      return RACE_ITEM_MODE.RACE_FINISHED;
    }
    // Boat did not finish and race finished
    else if (result.elapsedTime === 0 && raceState === RACE_STATE.FINISHED) {
      return RACE_ITEM_MODE.BOAT_DNF;
    } else if (raceState === RACE_STATE.STARTED_AND_RUNNING) {
      return RACE_ITEM_MODE.RACING;
    } else {
      return RACE_ITEM_MODE.DEFAULT;
    }
  };

  useEffect(() => {
    populateResultList();
  }, []);

  useEffect(() => {
    updateResultList();
  }, [dataChanged, isAlternatePHRF]);

  return (
    <Screen style={styles.container}>
      <DialogPrompt
        title="Clear Race"
        message="Are you sure you want to clear this race?"
        content="This will clear all time values and ranking."
        positive="Yes"
        negative="Cancel"
        isVisible={clearRacePromptVisible}
        onNegativeButtonPress={() => setClearRacePromptVisible(false)}
        onPositiveButtonPress={handleClearRace}
      />
      <SectionHeader title="Race" onHelpPress={handleHelpPress} />
      <StopWatch
        startLabel="Start Race"
        stopLabel="Stop Race"
        resetLabel="Clear Race"
        startTimeOffset={elapsedTime}
        onElapsedChange={handleElapsedChange}
        onStart={handleOnStartRace}
        onStop={handleOnStopRace}
        onReset={handleReset}
      />
      <FlatList
        data={viewBoatResultList}
        keyExtractor={(resultItem) => {
          return resultItem.boat.id;
        }}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <BoatRaceListItem
            rank="Rank"
            name="Boat"
            rating="Rating"
            boatType="Type"
            correctedTime="Time"
            isHeader
          />
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View>
            <BoatRaceListItem
              rank={item.rank}
              name={item.boat.boatName}
              type={item.boat.boatType}
              rating={item.boat.rating}
              correctedTime={getBoatCorrectedTime(item, elapsedTime)}
              elapsedTime={getBoatElapsedTime(item, elapsedTime)}
              onFinishClick={() => handleBoatFinishClick(item)}
              renderMode={getRenderMode(item)}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
  },
  buttonContainer: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  buttonStyleLeft: {
    marginRight: 4,
  },
  buttonStyleRight: {
    marginLeft: 4,
  },
});

export default Race;
