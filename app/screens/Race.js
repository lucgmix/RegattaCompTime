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

function sortBoatArray(boatList) {
  console.log(boatList);
  return Array.from(boatList).sort((a, b) => {
    if (a.rating === b.rating) {
      return a.boatName > b.boatName ? 1 : -1;
    } else {
      return a.rating > b.rating ? 1 : -1;
    }
  });
}

function Race(props) {
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);
  const [viewBoatList, setViewBoatList] = useState([]);
  const { getBoatList, dataChanged } = useStorage();

  const [elapsedTime, setElapsedTime] = useState(0);

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

  const handleFinishClick = (boat) => {
    console.log(boat);
  };

  const populateBoatList = () => {
    getBoatList().then(({ data }) => {
      setViewBoatList(sortBoatArray(data));
    });
  };

  const handleElapsedChange = (elapsed) => {
    setElapsedTime(elapsed);
  };

  const formatBoatCorrectedTime = (boat, elapsed) => {
    return timeToString(
      getCorrectedTime(elapsed, boat.rating, isAlternatePHRF)
    );
  };

  useEffect(() => {
    populateBoatList();
  }, [dataChanged]);

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Race" onHelpPress={handleHelpPress} />
      <StopWatch onElapsedChange={handleElapsedChange} />
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
              correctedTime={formatBoatCorrectedTime(item, elapsedTime)}
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
