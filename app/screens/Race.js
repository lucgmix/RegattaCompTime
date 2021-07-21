import React, { useEffect, useState, useRef } from "react";
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
import HelpDialogPrompt from "../components/HelpDialogPrompt";
import { isEmpty } from "lodash";
import RaceTimer from "../components/RaceTimer";
import ElapsedTimeInputModal from "../components/ElapsedTimeInputModal";
import { differenceInMilliseconds, format } from "date-fns/";
import { RATING_OVERRIDE } from "../config/constants";

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
  isAlternatePHRF,
  getCorrectedTime,
  raceState
) {
  if (isEmpty(resultList)) return;
  const raceResults = Array.from(resultList);
  const finishItems = raceResults.filter((item) => item.rank !== "-");
  const notFinishItems = raceResults.filter((item) => item.rank === "-");

  if (raceState === RACE_STATE.FINISHED) {
    const sortedRaceResults = correctedTimeSortList(
      finishItems,
      isAlternatePHRF,
      getCorrectedTime
    );

    let rankCount = 1;
    let previousResult;
    sortedRaceResults.map((item, index) => {
      if (item) {
        if (
          previousResult &&
          previousResult.correctedTime === item.correctedTime
        ) {
          previousResult.rank = rankCount;
          item.rank = rankCount;
        } else {
          rankCount = index + 1;
          item.rank = rankCount;
        }
        previousResult = item;
        return item;
      }

      return item;
    });

    notFinishItems.map((item) => (item.rank = "-"));
    return sortedRaceResults.concat(notFinishItems);
  } else {
    correctedTimeSortList(raceResults, isAlternatePHRF, getCorrectedTime);
  }
  return raceResults;
}

function correctedTimeSortList(
  boatRaceResults,
  isAlternatePHRF,
  getCorrectedTime
) {
  const raceResults = Array.from(boatRaceResults);
  return raceResults.sort((a, b) => {
    const boatACorrectedTime = getCorrectedTime(
      a.elapsedTime,
      a.boat.rating,
      isAlternatePHRF
    );
    const boatBCorrectedTime = getCorrectedTime(
      b.elapsedTime,
      b.boat.rating,
      isAlternatePHRF
    );
    return boatACorrectedTime > boatBCorrectedTime ? 1 : -1;
  });
}

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
          "{0} Allows you to enter the race start time for the current day.\n\n{1} Allows you to start the race timer at the current time.\n\n{2} Allows you to modify the start time of a race that was finished.\n\n{3} Stops the race timer and displays ranking sorted results based on corrected time.\n\n{4} Clears the race results and sorts the boats by rating, faster boats appear higher in the list.\n\n{5} Click a boat's Finish button to record their race finish.\n\n{6} This button will replace the Finish button of a boat after you have finished a boat and the race (Finish Race). Clicking on it dislays a window that allows to edit the elapsed time of a boat. Corrected Time and Ranking will be recalculated automatically.",
        boldText: [
          "Start Time...",
          "Start Now",
          "Edit Start Time...",
          "Finish Race",
          "Clear Race",
          "Finish",
          "Edit...",
        ],
      };
      break;
  }

  return applyBoldStyle(textToStyle);
};

function Race() {
  const [viewBoatResultList, setViewBoatResultList] = useState([]);

  const [clearRacePromptVisible, setClearRacePromptVisible] = useState(false);
  const [stopRacePromptVisible, setStopRacePromptVisible] = useState(false);
  const [editElapsedTimePromptVisible, setEditElapsedTimePromptVisible] =
    useState(false);
  const [elapsedTimePromptVisible, setElapsedTimePromptVisible] =
    useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [startTimePromptVisible, setStartTimePromptVisible] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [boatElapsedTime, setBoatElapsedTime] = useState(0);
  const [boatEditResult, setBoatEditResult] = useState(null);

  const [raceTimerStartDate, setRaceTimerStartDate] = useState(new Date());
  const [stopWatchStartTime, setStopWatchStartTime] = useState(0);

  const [stopWatchState, setStopWatchState] = useState();
  const [raceState, setRaceState] = useState(RACE_STATE.NOT_STARTED);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const { getBoatList, getRaceResults, storeRaceResults, boatDataChanged } =
    useStorage();

  const raceResultListRef = useRef();

  const {
    getCorrectedTime,
    isAlternatePHRF,
    millisecondsToDuration,
    deviceCanEmail,
    sendEmail,
  } = usePHRF();

  const handleEmailPress = () => {
    sendEmail(
      `RegattaCompTime - Race of ${format(
        raceTimerStartDate,
        "MMMM do, yyyy h:mm:ss a"
      )}`,
      buildEmailContent()
    );
  };

  const buildEmailContent = () => {
    let contentText = `Race Date : ${format(
      raceTimerStartDate,
      "EEEE, MMMM do  yyyy"
    )} \nRace Start Time: ${format(
      raceTimerStartDate,
      "h:mm:ss a"
    )}\nRace Elapsed Time: ${millisecondsToDuration(elapsedTime)}\n\n`;

    viewBoatResultList.map((result) => {
      const ct = getBoatCorrectedTime(result, result.elapsedTime);
      if (result && result.rank !== "-") {
        contentText += `${result.rank}  ${result.boat.boatName}\n    Class: ${
          result.boat.boatType
        }\n    Rating: ${result.boat.rating} (${getFS_NFS(
          result.boat.rating,
          result.boat
        )})\n    Elapsed Time: ${millisecondsToDuration(
          result.elapsedTime
        )}\n    Corrected Time: ${ct}`;
        contentText += `\n\n`;
      }
    });

    function getFS_NFS(rating, boat) {
      if (rating.toString() === boat.ratingFS) {
        return RATING_OVERRIDE.FS;
      }
      if (rating.toString() === boat.ratingNFS) {
        return RATING_OVERRIDE.NFS;
      }
    }
    return contentText;
  };

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const handleHideStartTimePrompt = () => {
    setStartTimePromptVisible(false);
  };

  const populateResultList = () => {
    getBoatList().then(({ boatData }) => {
      getRaceResults().then(({ ok, resultsData }) => {
        if (ok && !isEmpty(resultsData.boatResults)) {
          const updatedBoatsResultsData = boatData.reduce((acc, boat) => {
            const updatedBoatResult = resultsData.boatResults.find(
              (boatResult) => {
                return boatResult.boat.id === boat.id;
              }
            );

            if (updatedBoatResult) {
              updatedBoatResult.boat = boat;
              acc.push(updatedBoatResult);
              return acc;
            } else {
              return { boat, rank: "-", elapsedTime: 0, correctedTime: 0 };
            }
          }, []);

          const boatResults = updatedBoatsResultsData || viewBoatResultList;
          if (resultsData.raceState && Array.isArray(boatResults)) {
            setRaceState(resultsData.raceState);

            if (resultsData.raceState !== RACE_STATE.FINISHED) {
              if (resultsData.raceState === RACE_STATE.RESET_CLEARED) {
                setRaceState(resultsData.raceState);
                setStopWatchState(STOPWATCH_STATE.RESET);
                resultsData.raceStartTime &&
                  setRaceTimerStartDate(new Date(resultsData.raceStartTime));
                resultsData.raceElapsedTime &&
                  setStopWatchStartTime(resultsData.raceElapsedTime);
              }
              setViewBoatResultList(ratingSortResults(boatResults));
              raceStartTimeAction(
                getDateTimeForCurrentDay(resultsData.raceStartTime)
              );
            } else {
              setViewBoatResultList(
                correctTimeSortResults(
                  boatResults,
                  isAlternatePHRF,
                  getCorrectedTime,
                  RACE_STATE.FINISHED
                )
              );

              const hasResults =
                boatResults.find((result) => result.elapsedTime > 0) !==
                undefined;
              setEmailEnabled(hasResults);

              resultsData.raceElapsedTime &&
                setElapsedTime(resultsData.raceElapsedTime);
              resultsData.raceStartTime &&
                setRaceTimerStartDate(new Date(resultsData.raceStartTime));
              resultsData.raceElapsedTime &&
                setStopWatchStartTime(resultsData.raceElapsedTime);

              setRaceState(RACE_STATE.FINISHED);
              setStopWatchState(STOPWATCH_STATE.STOPPED);
            }
          }
        } else {
          const boatResultList = boatData.map((boat) => {
            return { boat, rank: "-", elapsedTime: 0, correctedTime: 0 };
          });
          setViewBoatResultList(ratingSortResults(boatResultList));
        }
      });
    });
  };

  const updateResultList = () => {
    if (isEmpty(viewBoatResultList)) return;
    getBoatList().then(({ boatData }) => {
      // Iterate fleet boat list
      const updatedBoatResultList = boatData.map((boat) => {
        // Find a result for the current boat
        const resultOfBoat = Array.from(viewBoatResultList).find((result) => {
          if (result.boat.id === boat.id) {
            return result;
          }
        });

        // We have a result so we update the boat and the results data.
        if (resultOfBoat) {
          const newResult = {
            ...resultOfBoat,
            boat,
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

      setViewBoatResultList(
        correctTimeSortResults(
          getUpdatedResultRanking(updatedBoatResultList),
          isAlternatePHRF,
          getCorrectedTime,
          raceState
        )
      );
    });
  };

  const getBoatCorrectedTime = (result, elapsed) => {
    return millisecondsToDuration(
      getCorrectedTime(
        result.elapsedTime || elapsed,
        result.boat.rating,
        isAlternatePHRF
      )
    );
  };

  const getBoatElapsedTime = (result, elapsed) => {
    return result.elapsedTime > 0
      ? millisecondsToDuration(result.elapsedTime)
      : millisecondsToDuration(elapsed);
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
    const flooredElapsedTime = floorMilliseconds(elapsedTime);
    const resultCopy = { ...result };
    resultCopy.originalStartTime = raceTimerStartDate.getTime();
    (resultCopy.originalElapsedTime = flooredElapsedTime),
      (resultCopy.elapsedTime = flooredElapsedTime);
    resultCopy.correctedTime = getCorrectedTime(
      flooredElapsedTime,
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
      raceElapsedTime: flooredElapsedTime,
      boatResults: allBoats,
      raceState: RACE_STATE.STARTED_AND_RUNNING,
    }).then((response) => {
      if (!response.ok) {
        console.warn(response.error);
      }
    });
  };

  const floorMilliseconds = (elapsedTime) => {
    const elapsedTimeDate = new Date(elapsedTime);
    elapsedTimeDate.setMilliseconds(0);
    return elapsedTimeDate.getTime();
  };

  const handleStopRaceConfirm = () => {
    setStopRacePromptVisible(false);
    setRaceState(RACE_STATE.FINISHED);
    setStopWatchState(STOPWATCH_STATE.STOPPED);

    const noMillisecondsElapsedTime = floorMilliseconds(elapsedTime);
    setElapsedTime(noMillisecondsElapsedTime);

    if (!viewBoatResultList) return;

    const allBoatResultList = Array.from(viewBoatResultList);
    const boatThatFinished = Array.from(allBoatResultList).filter(
      (result) => result.rank > 0
    );

    setEmailEnabled(boatThatFinished && boatThatFinished.length > 0);

    let sortedBoatResultList = allBoatResultList;
    // If no boats finished, skip sorting.
    if (boatThatFinished.length > 0) {
      // Update all boats with elapedTime and corrected time and save
      sortedBoatResultList = correctTimeSortResults(
        allBoatResultList,
        isAlternatePHRF,
        getCorrectedTime,
        RACE_STATE.FINISHED
      );
    }

    storeRaceResults({
      raceStartTime: raceTimerStartDate.getTime(),
      raceElapsedTime: noMillisecondsElapsedTime,
      boatResults: sortedBoatResultList,
      raceState: RACE_STATE.FINISHED,
    }).then((response) => {
      if (response.ok) {
        setViewBoatResultList(sortedBoatResultList);
        raceResultListRef &&
          raceResultListRef.current.scrollToIndex({
            animated: false,
            index: 0,
          });
      }
    });
  };

  const handleStopRace = () => {
    setStopRacePromptVisible(true);
  };

  const handleClearRace = () => {
    setClearRacePromptVisible(false);
    setRaceState(RACE_STATE.RESET_CLEARED);

    const resetBoatResults = Array.from(viewBoatResultList || []).map(
      (result) => {
        result.elapsedTime = 0;
        result.correctedTime = 0;
        result.rank = "-";
        result.originalStartTime = 0;
        result.originalElapsedTime = 0;
        return result;
      }
    );

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

    const elapsedSinceStartTime = floorMilliseconds(
      new Date().getTime() - timeDate.getTime()
    );

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
    const now = new Date(floorMilliseconds(new Date().getTime()));
    setRaceTimerStartDate(new Date(now));

    storeRaceResults({
      raceStartTime: now,
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

  const handleEditElapsedTime = (result) => {
    setBoatEditResult(result);
    setEditElapsedTimePromptVisible(true);
  };

  const handleStartTimeChange = (date) => {
    const selectedTimeDate = new Date(floorMilliseconds(date.getTime()));

    // Race Finished, allow edit of race start time
    if (raceState === RACE_STATE.FINISHED) {
      const newStartDateMilliseconds = selectedTimeDate.getTime();
      const elapsedDiff = floorMilliseconds(
        differenceInMilliseconds(
          raceTimerStartDate.getTime(),
          newStartDateMilliseconds
        )
      );
      const newElapsedTime = floorMilliseconds(
        Math.abs(elapsedDiff + elapsedTime)
      );

      let shortestElapsed = viewBoatResultList[0].elapsedTime + elapsedDiff;
      viewBoatResultList.forEach((boatResult) => {
        if (boatResult && boatResult.elapsedTime > 0) {
          if (boatResult.elapsedTime < shortestElapsed) {
            shortestElapsed = boatResult.elapsedTime;
          }
        }
      });

      // Don't allow setting the start time to a value
      // past the shortest elapsed time of a boat that finished.
      if (Math.abs(newElapsedTime) < Math.abs(shortestElapsed)) {
        setStartTimePromptVisible(true);
        return;
      }

      let boatCorrectedElapsedTime;
      const updatedBoatsElapsed = Array.from(viewBoatResultList).map(
        (boatResult) => {
          if (boatResult.elapsedTime !== 0) {
            boatCorrectedElapsedTime = Math.abs(
              Math.round(
                Math.floor(boatResult.originalElapsedTime) + elapsedDiff
              )
            );
            boatResult.elapsedTime = boatCorrectedElapsedTime;
            boatResult.originalElapsedTime = boatCorrectedElapsedTime;
          }
          return boatResult;
        }
      );

      storeRaceResults({
        boatResults: updatedBoatsElapsed,
        raceStartTime: selectedTimeDate.getTime(),
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
        raceState: raceState,
      }).then((response) => {
        if (response.ok) {
          raceStartTimeAction(newTimeDate);
        }
      });
    }
  };

  const handleBoatElapsedTimeEdit = () => {
    setEditElapsedTimePromptVisible(false);

    const updatedElapsedTimeResults = Array.from(viewBoatResultList);
    // Find the boat that just got edited
    const resultWithOriginalElapsedTime = updatedElapsedTimeResults.find(
      (item) => {
        return item.boat.id === boatEditResult.boat.id;
      }
    );

    // Set the boat results elapsedTime and originalElapsedTime
    // with the elapsed time that was set in the time input.
    if (boatElapsedTime < elapsedTime) {
      const flooredBoatElapsedTime = floorMilliseconds(
        Math.abs(boatElapsedTime)
      );
      resultWithOriginalElapsedTime.elapsedTime = flooredBoatElapsedTime;
      resultWithOriginalElapsedTime.originalElapsedTime =
        flooredBoatElapsedTime;

      storeRaceResults({
        boatResults: updatedElapsedTimeResults,
        raceState: raceState,
        raceElapsedTime: floorMilliseconds(elapsedTime),
        raceStartTime: raceTimerStartDate,
      }).then((response) => {
        if (response.ok) {
          updateResultList();
          setBoatElapsedTime(0);
          setBoatEditResult(null);
        }
      });
    } else {
      setElapsedTimePromptVisible(true);
    }
  };

  const onBoatElapsedTimeChanged = (time) => {
    if (time !== 0) {
      setBoatElapsedTime(time * 1000);
    }
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

  const handleAppStateChange = (newState) => {
    if (newState === "active") {
      populateResultList();
      updateResultList();
    }
  };

  useEffect(() => {
    populateResultList();
    return () => {
      setViewBoatResultList([]);
    };
  }, []);

  useEffect(() => {
    populateResultList();
    return () => {
      setViewBoatResultList([]);
    };
  }, [boatDataChanged]);

  useEffect(() => {
    updateResultList();
    return () => {
      setViewBoatResultList([]);
    };
  }, [boatDataChanged, isAlternatePHRF]);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  return (
    <Screen style={styles.container}>
      <ElapsedTimeInputModal
        isModalVisible={editElapsedTimePromptVisible}
        boatEditResult={boatEditResult}
        onElapsedTimeChange={onBoatElapsedTimeChanged}
        onModalButtonPress={handleBoatElapsedTimeEdit}
        buttonLabel="Done"
      />
      <DialogPrompt
        title="Edit Elapsed Time"
        message={`Oops!\n\nSetting the elapsed time of a boat to be 0 or longer than the race's elapsed time is not allowed.`}
        positive="Got it"
        isVisible={elapsedTimePromptVisible}
        onPositiveButtonPress={() => setElapsedTimePromptVisible(false)}
      />
      <DialogPrompt
        title="Edit Start Time"
        message={`Oops!\n\nSetting the start time to be after the first boat finish time or after the end of race is not allowed.`}
        positive="Got it"
        isVisible={startTimePromptVisible}
        onPositiveButtonPress={handleHideStartTimePrompt}
      />
      <HelpDialogPrompt
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
        content={`This will stop the race timer and sort final results.\n\nTip : When a race is finished, you can edit race start time and boat elapsed time for more accurate results. Any boat data can also be updated under the Fleet section. Changes to boat data will immediately be reflected in the Race section potentially affecting results.`}
        positive="Yes"
        negative="Cancel"
        isVisible={stopRacePromptVisible}
        onNegativeButtonPress={() => setStopRacePromptVisible(false)}
        onPositiveButtonPress={handleStopRaceConfirm}
      />
      <SectionHeader
        title="Race"
        onEmailPress={handleEmailPress}
        onHelpPress={handleHelpPress}
        emailVisible={deviceCanEmail}
        emailEnabled={emailEnabled}
      />
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
        stopLabel="Finish Race"
        resetLabel="Clear Race"
        startTimeOffset={stopWatchStartTime}
        onElapsedChange={handleElapsedChange}
        onStop={handleStopRace}
        onReset={handleReset}
        onStartToday={() => handleStartTimeChange(raceTimerStartDate)}
        endRaceDisabled={raceState !== RACE_STATE.STARTED_AND_RUNNING}
        resetRaceDisabled={raceState !== RACE_STATE.FINISHED}
        state={stopWatchState}
        date={raceTimerStartDate}
      />
      <FlatList
        ref={raceResultListRef}
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
            boatType="Boat Class"
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
              ratingError={item.boat.ratingError}
              correctedTime={getBoatCorrectedTime(item, elapsedTime)}
              elapsedTime={getBoatElapsedTime(item, elapsedTime)}
              onFinishClick={() => handleBoatFinishClick(item)}
              onEditClick={() => handleEditElapsedTime(item)}
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
