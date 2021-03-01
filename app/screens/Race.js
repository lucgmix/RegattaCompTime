import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import BoatRaceListItem from "../components/lists/BoatRaceListItem";
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

const RACE_STATE = {
  NOT_STARTED: "not_started",
  STARTED_AND_RUNNING: "started",
  STOPPED_FINISHED: "finished",
  RESET_CLEARED: "reset",
};

function ratingSortResults(resultList) {
  return Array.from(resultList).sort((a, b) => {
    if (a.boat.rating === b.boat.rating) {
      return a.boat.boatName > b.boat.boatName ? 1 : -1;
    } else {
      return a.boat.rating > b.boat.rating ? 1 : -1;
    }
  });
}

function rankSortResults(resultList) {
  return Array.from(resultList).sort((a, b) => {
    if (a.rank === b.rank) {
      return a.boat.boatName > b.boat.boatName ? 1 : -1;
    } else {
      return a.rank > b.rank ? 1 : -1;
    }
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

  const {
    getCorrectedTime,
    getElapsedDiff,
    secondsToHms,
    isAlternatePHRF,
    timeToString,
  } = usePHRF();

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

  const handleElapsedChange = (elapsed) => {
    setElapsedTime(elapsed);
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

  const updateResultRanking = () => {
    if (raceState === RACE_STATE.STOPPED_FINISHED) {
      const updatedCorrectedTime = viewBoatResultList.map((result) => {
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

      setViewBoatResultList(rankSortResults(viewBoatResultList));
    }
  };

  const handleFinishClick = (result) => {
    if (raceState !== RACE_STATE.STARTED_AND_RUNNING) return;

    result.elapsedTime = elapsedTime;
    result.correctedTime = getCorrectedTime(
      elapsedTime,
      result.boat.rating,
      isAlternatePHRF
    );

    const finishedBoatResults = viewBoatResultList.filter((result) => {
      return result.elapsedTime > 0;
    });

    finishedBoatResults.sort((a, b) => {
      return a.correctedTime > b.correctedTime ? 1 : -1;
    });

    for (let i = 0; i < finishedBoatResults.length; i++) {
      finishedBoatResults[i].rank = i + 1;
    }
  };

  const handleOnStartRace = () => {
    setRaceState(RACE_STATE.STARTED_AND_RUNNING);
    console.log("handleOnStartRace Called");
  };

  const handleOnStopRace = () => {
    setRaceState(RACE_STATE.STOPPED_FINISHED);
    console.log("handleOnStopRace Called");
    const hasAtLeastOneFinish = viewBoatResultList.filter(
      (result) => result.rank > 0
    );

    if (hasAtLeastOneFinish.length === 0) return;

    const finalResults = Array.from(viewBoatResultList).sort((a, b) => {
      return a.rank > b.rank ? 1 : -1;
    });

    setViewBoatResultList(finalResults);
  };

  const handleClearRace = () => {
    setClearRacePromptVisible(false);
    setRaceState(RACE_STATE.RESET_CLEARED);
    console.log("handleReset Called");
    const resetBoatResults = viewBoatResultList.map((result) => {
      result.elapsedTime = 0;
      result.correctedTime = 0;
      result.rank = "-";
      return result;
    });
    setViewBoatResultList(ratingSortResults(resetBoatResults));
    setElapsedTime(elapsedOffset);
  };

  const handleReset = () => {
    setClearRacePromptVisible(true);
  };

  const getResultItemMode = () => {
    switch (raceState) {
      case RACE_STATE.RESET_CLEARED:
        return BoatRaceListItem.RACE_ITEM_MODE.IDLE;
      case RACE_STATE.STARTED_AND_RUNNING:
        return BoatRaceListItem.RACE_ITEM_MODE.RACING;
      case RACE_STATE.STOPPED_FINISHED:
        return BoatRaceListItem.RACE_ITEM_MODE.FINISHED;
    }
  };

  useEffect(() => {
    populateResultList();
  }, []);

  useEffect(() => {
    updateResultRanking();
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
        startTimeOffset={elapsedTime > 0 ? elapsedTime : elapsedOffset}
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
            correctedTime="Corrected"
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
              onFinishClick={() => handleFinishClick(item)}
              finishDisabled={item.elapsedTime !== 0}
              mode={() => getResultItemMode()}
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
