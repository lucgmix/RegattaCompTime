import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
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

function sortBoatArray(boatList) {
  return Array.from(boatList).sort((a, b) => {
    if (a.boatType === b.boatType) {
      return a.boatName > b.boatName ? 1 : -1;
    } else {
      return a.boatType > b.boatType ? 1 : -1;
    }
  });
}

function Race(props) {
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [viewBoatList, setViewBoatList] = useState([]);
  const { storeBoatList, getBoatList, dataChanged } = useStorage();

  const [timerStart, setTimerStart] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [timerReset, setTimerReset] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);

  const toggleTimer = () => {
    setTimerStart(!timerStart);
    setTimerReset(false);
  };

  const resetTimer = () => {
    setTimerStart(false);
    setTimerReset(true);
  };

  const toggleStopwatch = () => {
    setStopwatchStart(!stopwatchStart);
    setStopwatchReset(false);
  };

  resetStopwatch = () => {
    setStopwatchStart(false);
    setStopwatchReset(true);
  };

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const handleFinishClick = (boat) => {
    console.log(boat);
  };

  const populateBoatList = () => {
    getBoatList().then(({ data }) => {
      setViewBoatList(sortBoatArray(data));
    });
  };

  const options = {
    container: {
      backgroundColor: "#000",
      padding: 5,
      borderRadius: 5,
      width: 220,
    },
    text: {
      fontSize: 30,
      color: "#FFF",
      marginLeft: 7,
    },
  };

  useEffect(() => {
    populateBoatList();
  }, [dataChanged]);

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Race" onHelpPress={handleHelpPress} />
      <StopWatch />
      <FlatList
        data={viewBoatList}
        keyExtractor={(boatItem) => {
          return boatItem.id;
        }}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <BoatRaceListItem
            name="Boat"
            rating="Rating"
            boatType="Type"
            correctedTime="Corrected Time"
            isHeader
          />
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View>
            <BoatRaceListItem
              name={item.boatName}
              type={item.boatType}
              rating={item.rating}
              // correctedTime={item.correctedTime}
              correctedTime="01:25:34"
              onFinishClick={() => handleFinishClick(item)}
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
