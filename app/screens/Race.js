import React, { useEffect, useState } from "react";
import { AppState, FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { applyBoldStyle } from "../utils/stringStyle";
import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import BoatRaceListItem, {
  RACE_ITEM_MODE,
} from "../components/lists/BoatRaceListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";

import StopWatch, { STOPWATCH_STATE } from "../components/StopWatch";
import DialogPrompt from "../components/DialogPrompt";
import { isEmpty } from "lodash";
import RaceTimer from "../components/RaceTimer";
import { toDate, format, set } from "date-fns/";

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
  getCorrectedTime,
  raceState
) {
  if (isEmpty(resultList)) return;

  const raceResults = Array.from(resultList);
  const finishItems = raceResults.filter((item) => item && item.rank !== "-");
  const notFinishItems = raceResults.filter((item) => item.rank === "-");

  if (raceState === RACE_STATE.FINISHED) {
    let rankCount = finishItems.length + 1;
    raceResults.map((item) => {
      if (item && item.rank === "-") {
        item.rank = rankCount;
        rankCount++;
        return item;
      }
      return item;
    });

    raceResults.sort((a, b) => {
      return a.rank > b.rank ? 1 : -1;
    });
    notFinishItems.map((item) => (item.rank = "-"));
  } else {
    raceResults.sort((a, b) => {
      const boatACorrectedTime =
        a.correctedTime ||
        getCorrectedTime(elapsedTime, a.boat.rating, isAlternatePHRF);
      const boatBCorrectedTime =
        b.correctedTime ||
        getCorrectedTime(elapsedTime, b.boat.rating, isAlternatePHRF);
      return boatACorrectedTime > boatBCorrectedTime ? 1 : -1;
    });
  }

  return raceResults;
}

function Race() {
  const [viewBoatResultList, setViewBoatResultList] = useState([]);

  const [clearRacePromptVisible, setClearRacePromptVisible] = useState(false);
  const [stopRacePromptVisible, setStopRacePromptVisible] = useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [startTimePromptVisible, setStartTimePromptVisible] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [raceTimerStartDate, setRaceTimerStartDate] = useState(new Date());

  const [raceState, setRaceState] = useState(RACE_STATE.NOT_STARTED);
  const {
    getBoatList,
    getRaceResults,
    storeRaceResults,
    boatDataChanged,
  } = useStorage();

  const [stopWatchStartTime, setStopWatchStartTime] = useState(0);
  const [stopWatchState, setStopWatchState] = useState();

  const { getCorrectedTime, isAlternatePHRF, timeToString } = usePHRF();

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const handleHideStartTimePrompt = () => {
    setStartTimePromptVisible(false);
  };

  const populateResultList = () => {
    getRaceResults().then(({ ok, resultsData }) => {
      if (ok && !isEmpty(resultsData.boatResults)) {
        const boats = resultsData.boatResults || viewBoatResultList;
        if (resultsData.raceState && Array.isArray(boats)) {
          setRaceState(resultsData.raceState);

          if (resultsData.raceState !== RACE_STATE.FINISHED) {
            setViewBoatResultList(ratingSortResults(boats));
            raceStartTimeAction(
              getDateTimeForCurrentDay(resultsData.raceStartTime)
            );
          } else {
            setViewBoatResultList(
              correctTimeSortResults(
                boats,
                elapsedTime,
                isAlternatePHRF,
                getCorrectedTime,
                resultsData.raceState
              )
            );
            setElapsedTime(resultsData.raceElapsedTime);
            setRaceTimerStartDate(new Date(resultsData.raceStartTime));
            setStopWatchStartTime(resultsData.raceElapsedTime);
          }
        }
      } else {
        getBoatList().then(({ boatData }) => {
          const boatResultList = boatData.map((boat) => {
            return { boat, rank: "-", elapsedTime: 0, correctedTime: 0 };
          });
          setViewBoatResultList(ratingSortResults(boatResultList));
        });
      }
    });
  };

  const updateResultList = () => {
    getBoatList().then(({ boatData }) => {
      // Iterate fleet boat list
      const updatedBoatResultList = boatData.map((boat) => {
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
            boat,
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
            getCorrectedTime,
            raceState
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
    resultCopy.originalStartTime = raceTimerStartDate.getTime();
    (resultCopy.originalElapsedTime = elapsedTime),
      (resultCopy.elapsedTime = elapsedTime);
    resultCopy.correctedTime = getCorrectedTime(
      elapsedTime,
      resultCopy.boat.rating,
      isAlternatePHRF
    );

    const allBoats = Array.from(viewBoatResultList);
    const originalResultIndex = allBoats.findIndex(
      (raceResult) => raceResult.boat.id === resultCopy.boat.id
    );
    allBoats[originalResultIndex] = resultCopy;

    const finishedBoatResults = Array.from(allBoats).filter((raceResult) => {
      return raceResult.elapsedTime > 0;
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
        getCorrectedTime,
        RACE_STATE.FINISHED
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
      result.originalStartTime = 0;
      result.originalElapsedTime = 0;
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

  const handleStartNow = () => {
    setRaceState(RACE_STATE.STARTED_AND_RUNNING);
    setElapsedTime(0);
    setStopWatchStartTime(0);
    setRaceTimerStartDate(new Date());

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

  const handleReset = () => {
    setClearRacePromptVisible(true);
  };

  const handleStartTimeChange = (date) => {
    const selectedTimeDate = new Date(date.getTime());
    selectedTimeDate.setSeconds(0);

    // Race Finished, allow edit of race start time
    if (raceState === RACE_STATE.FINISHED) {
      const resultWithOriginalStartTime = viewBoatResultList.find(
        (item) => item.originalStartTime > 0
      );

      const raceStartTimeMilliSeconds =
        (resultWithOriginalStartTime &&
          resultWithOriginalStartTime.originalStartTime) ||
        raceTimerStartDate.getTime();
      const elapsedToCompare =
        (resultWithOriginalStartTime &&
          resultWithOriginalStartTime.originalElapsedTime) ||
        elapsedTime;
      const newStartDateMilliseconds = selectedTimeDate.getTime();
      const elapsedDiff = raceStartTimeMilliSeconds - newStartDateMilliseconds;
      const newElapsedTime = elapsedDiff + elapsedToCompare;

      let shortestElapsed = newElapsedTime;
      viewBoatResultList.forEach((boatResult) => {
        if (boatResult && boatResult.elapsedTime > 0) {
          if (boatResult.elapsedTime < shortestElapsed) {
            shortestElapsed = boatResult.elapsedTime;
          }
        }
      });

      // Don't allow setting the start time to a value
      // past the shortest elapsed time of a boat that finished.
      shortestElapsed += elapsedDiff;
      if (elapsedDiff >= shortestElapsed) {
        setStartTimePromptVisible(true);
        setRaceTimerStartDate(raceTimerStartDate);
        return;
      }

      const updatedBoatsElapsed = viewBoatResultList.map((boatResult) => {
        if (boatResult.elapsedTime !== 0) {
          const boatCorrectedElapsedTime =
            boatResult.originalStartTime -
            newStartDateMilliseconds +
            boatResult.originalElapsedTime;
          boatResult.elapsedTime = boatCorrectedElapsedTime;
        }
        return boatResult;
      });

      storeRaceResults({
        boatResults: updatedBoatsElapsed,
        raceStartTime: selectedTimeDate,
        raceElapsedTime: newElapsedTime,
        raceState: raceState,
      }).then((response) => {
        if (response.ok) {
          setElapsedTime(newElapsedTime);
          setRaceTimerStartDate(selectedTimeDate);
          setStopWatchStartTime(newElapsedTime);
          updateResultList();
        }
      });
    } else {
      const newTimeDate = getDateTimeForCurrentDay(selectedTimeDate, true);

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
    }
  };

  const getDateTimeForCurrentDay = (date, zeroSeconds = false) => {
    const originalDate = new Date(date);
    const newTimeDate = new Date();
    newTimeDate.setHours(originalDate.getHours());
    newTimeDate.setMinutes(originalDate.getMinutes());
    zeroSeconds
      ? newTimeDate.setSeconds(0)
      : newTimeDate.setSeconds(originalDate.getSeconds());
    return newTimeDate;
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

  const getRaceHelpString = (tag) => {
    let textToStyle;
    switch (tag) {
      case "message":
        textToStyle = {
          sentence: `The {0} section allows you to track realtime results (Corrected Time and Elapsed race time) for boats in a race.`,
          boldText: ["Race"],
        };
        break;
      case "content":
        textToStyle = {
          sentence:
            "{0} Allows you to enter the race start time for the current day.\n\n{1} Allows you to start the race timer at the current time.\n\n{2} Allows you to modify the start time of a race that was finished.\n\n{3} Stops the race timer and displays ranking sorted results based on corrected time.\n\n{4} Clears the race results and sorts the boats by rating, faster boats appear higher in the list.\n\n{5} Click a boat's Finish button to record their race finish.",
          boldText: [
            "Start Time...",
            "Start Now",
            "Edit Start Time...",
            "Finish Race",
            "Clear Race",
            "Finish",
          ],
        };
        break;
    }

    return applyBoldStyle(textToStyle);
  };

  const handleAppStateChange = (newState) => {
    if (newState === "active") {
      populateResultList();
    }
  };

  useEffect(() => {
    populateResultList();
  }, []);

  useEffect(() => {
    updateResultList();
  }, [boatDataChanged, isAlternatePHRF]);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  return (
    <Screen style={styles.container}>
      <DialogPrompt
        title="Edit Start Time"
        message={`Oops!\n\nSetting the start time to be after the first boat finish time or after the end of race is not allowed.`}
        positive="Got it"
        isVisible={startTimePromptVisible}
        onPositiveButtonPress={handleHideStartTimePrompt}
      />
      <DialogPrompt
        title="Race Help"
        message={getRaceHelpString("message")}
        content={getRaceHelpString("content")}
        positive="Got it"
        isVisible={helpPromptVisible}
        onPositiveButtonPress={() => setHelpPromptVisible(false)}
      />
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
        title="Finish Race"
        message="Are you sure you want to finish this race?"
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
        startTimeDisabled={raceState === RACE_STATE.STARTED_AND_RUNNING}
        startNowDisabled={
          raceState === RACE_STATE.STARTED_AND_RUNNING ||
          raceState === RACE_STATE.FINISHED
        }
        editMode={raceState === RACE_STATE.FINISHED}
      />
      <StopWatch
        startLabel="Start Race"
        stopLabel="Finish Race"
        resetLabel="Clear Race"
        startTimeOffset={stopWatchStartTime}
        onElapsedChange={handleElapsedChange}
        onStop={handleStopRace}
        onReset={handleReset}
        endRaceDisabled={raceState !== RACE_STATE.STARTED_AND_RUNNING}
        resetRaceDisabled={raceState !== RACE_STATE.FINISHED}
        state={stopWatchState}
        date={raceTimerStartDate}
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
            name="Boat Name"
            rating="Rating"
            boatType="Boat Type"
            correctedTime="Comp Time"
            elapsedTime="Elapsed Time"
            isHeader
          />
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View>
            <BoatRaceListItem
              rank={item.rank}
              name={item.boat.boatName}
              boatType={item.boat.boatType}
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
