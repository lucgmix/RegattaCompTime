import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
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
import StopWatch, { STOPWATCH_STATE } from "../components/StopWatch";
import DialogPrompt from "../components/DialogPrompt";
import { isEmpty } from "lodash";
import RaceTimer from "../components/RaceTimer";
import { date } from "yup";
import { secondsToHms } from "../utils/phrf";

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

function Race(props) {
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [viewBoatResultList, setViewBoatResultList] = useState([]);
  const [clearRacePromptVisible, setClearRacePromptVisible] = useState(false);
  const [stopRacePromptVisible, setStopRacePromptVisible] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [raceTimerStartDate, setRaceTimerStartDate] = useState(new Date());

  const [raceState, setRaceState] = useState(RACE_STATE.NOT_STARTED);
  const {
    getBoatList,
    getRaceResults,
    storeRaceResults,
    dataChanged,
  } = useStorage();

  const [stopWatchStartTime, setStopWatchStartTime] = useState(0);
  const [stopWatchState, setStopWatchState] = useState();

  const { getCorrectedTime, isAlternatePHRF, timeToString } = usePHRF();

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const populateResultList = () => {
    getRaceResults().then(({ ok, data }) => {
      const raceResults = data;
      if (ok && !isEmpty(raceResults.boatResults)) {
        const boats = raceResults.boatResults || viewBoatResultList;
        if (raceResults.raceState && Array.isArray(boats)) {
          setViewBoatResultList(
            correctTimeSortResults(
              boats,
              raceResults.elapsedTime,
              isAlternatePHRF,
              getCorrectedTime
            )
          );
          setRaceState(raceResults.raceState);

          if (raceResults.raceState !== RACE_STATE.FINISHED) {
            raceStartTimeAction(new Date(raceResults.raceStartTime));
          } else {
            setRaceTimerStartDate(new Date(raceResults.raceStartTime));
            setStopWatchStartTime(raceResults.raceElapsedTime);
          }
        }
      } else {
        getBoatList().then(({ data }) => {
          const boatResultList = data.map((boat) => {
            return { boat, rank: "-", elapsedTime: 0, correctedTime: 0 };
          });
          setViewBoatResultList(ratingSortResults(boatResultList));
        });
      }
    });
  };

  const updateResultList = () => {
    getBoatList().then(({ data }) => {
      // Iterate fleet boat list
      const updatedBoatResultList = data.map((boat) => {
        // Find a result for the current boat
        const resultOfBoat =
          !isEmpty(viewBoatResultList) &&
          Array.from(viewBoatResultList).find(
            (result) => result.boat.id === boat.id
          );
        // We have a result so we update the boat and the results data.
        if (resultOfBoat) {
          const newResult = {
            ...resultOfBoat,
            boat: boat,
            // elapsedTime: resultOfBoat.elapsedTime + stopWatchStartTime,
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

    storeRaceResults({
      raceStartTime: raceTimerStartDate.getTime(),
      raceElapsedTime: elapsedTime,
      boatResults: allBoats,
      raceState: RACE_STATE.STARTED_AND_RUNNING,
    }).then((response) => {
      if (!response.ok) {
        console.warn(response.error);
      }
    });
  };

  const handleStopRaceConfirm = () => {
    setStopRacePromptVisible(false);
    setRaceState(RACE_STATE.FINISHED);
    setStopWatchState(STOPWATCH_STATE.STOPPED);

    if (!viewBoatResultList) return;

    const allBoatResultList = Array.from(viewBoatResultList);
    const boatThatFinished = Array.from(allBoatResultList).filter(
      (result) => result.rank > 0
    );

    let sortedBoatResultList = allBoatResultList;
    // If no boats finished, skip sorting.
    if (boatThatFinished.length > 0) {
      // Update all boats with elapedTime and corrected time and save
      sortedBoatResultList = correctTimeSortResults(
        allBoatResultList,
        elapsedTime,
        isAlternatePHRF,
        getCorrectedTime
      );
    }

    storeRaceResults({
      raceStartTime: raceTimerStartDate.getTime(),
      raceElapsedTime: elapsedTime,
      boatResults: sortedBoatResultList,
      raceState: RACE_STATE.FINISHED,
    }).then((response) => {
      if (response.ok) {
        setViewBoatResultList(sortedBoatResultList);
      }
    });
  };

  const handleStopRace = () => {
    setStopRacePromptVisible(true);
  };

  const handleClearRace = () => {
    setClearRacePromptVisible(false);
    setRaceState(RACE_STATE.RESET_CLEARED);

    if (!viewBoatResultList) return;

    const resetBoatResults = Array.from(viewBoatResultList).map((result) => {
      result.elapsedTime = 0;
      result.correctedTime = 0;
      result.rank = "-";
      return result;
    });

    storeRaceResults({
      raceStartTime: raceTimerStartDate.getTime(),
      raceElapsedTime: 0,
      boatResults: resetBoatResults,
      raceState: RACE_STATE.RESET_CLEARED,
    }).then((response) => {
      if (response.ok) {
        setViewBoatResultList(ratingSortResults(resetBoatResults));
        setElapsedTime(0);
        setStopWatchState(STOPWATCH_STATE.RESET);
      }
    });
  };

  const handleReset = () => {
    setClearRacePromptVisible(true);
  };

  const handleStartNow = () => {
    setRaceState(RACE_STATE.STARTED_AND_RUNNING);
    setElapsedTime(0);
    setStopWatchStartTime(0);

    storeRaceResults({
      raceStartTime: new Date().getTime(),
      raceElapsedTime: elapsedTime,
      boatResults: viewBoatResultList,
      raceState: RACE_STATE.STARTED_AND_RUNNING,
    }).then((response) => {
      if (response.ok) {
        setStopWatchState(STOPWATCH_STATE.STARTED);
      }
    });
  };

  const handleStartTimeChange = (date) => {
    const previousTimeDate = new Date(date.getTime());
    const newTimeDate = new Date();

    newTimeDate.setHours(previousTimeDate.getHours());
    newTimeDate.setMinutes(previousTimeDate.getMinutes());
    newTimeDate.setSeconds(0);

    storeRaceResults({
      boatResults: viewBoatResultList,
      raceStartTime: newTimeDate,
      raceElapsedTime: elapsedTime,
      raceState: RACE_STATE.STARTED_AND_RUNNING,
    }).then((response) => {
      if (response.ok) {
        raceStartTimeAction(newTimeDate);
      }
    });
  };

  const raceStartTimeAction = (timeDate) => {
    setRaceTimerStartDate(timeDate);

    const elapsedSinceStartTime = new Date().getTime() - timeDate.getTime();

    // Current time is later than race start time, start stopwatch
    if (elapsedSinceStartTime > 0) {
      startRaceTimer(elapsedSinceStartTime);
    } else {
      setTimeout(startRaceTimer, Math.abs(elapsedSinceStartTime));
    }
  };

  const startRaceTimer = (stopWatchTime = 0) => {
    setRaceState(RACE_STATE.STARTED_AND_RUNNING);

    setStopWatchStartTime(stopWatchTime);
    setElapsedTime(stopWatchTime);
    setStopWatchState(STOPWATCH_STATE.STARTED);
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
      <DialogPrompt
        title="Stop Race"
        message="Are you sure you want to stop this race?"
        content="This will stop the race timer and sort final results."
        positive="Yes"
        negative="Cancel"
        isVisible={stopRacePromptVisible}
        onNegativeButtonPress={() => setStopRacePromptVisible(false)}
        onPositiveButtonPress={handleStopRaceConfirm}
      />
      <SectionHeader title="Race" onHelpPress={handleHelpPress} />
      <RaceTimer
        startDate={raceTimerStartDate}
        onTimeChange={handleStartTimeChange}
        onStartNow={handleStartNow}
        startTimeDisabled={
          raceState === RACE_STATE.STARTED_AND_RUNNING ||
          raceState === RACE_STATE.FINISHED
        }
        startNowDisabled={
          raceState === RACE_STATE.STARTED_AND_RUNNING ||
          raceState === RACE_STATE.FINISHED
        }
      />
      <StopWatch
        startLabel="Start Race"
        stopLabel="Stop Race"
        resetLabel="Clear Race"
        startTimeOffset={stopWatchStartTime}
        onElapsedChange={handleElapsedChange}
        onStop={handleStopRace}
        onReset={handleReset}
        endRaceDisabled={raceState !== RACE_STATE.STARTED_AND_RUNNING}
        resetRaceDisabled={raceState !== RACE_STATE.FINISHED}
        state={stopWatchState}
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
