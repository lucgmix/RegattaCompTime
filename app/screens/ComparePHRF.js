import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Picker from "../components/Picker";
import Screen from "../components/Screen";
import Text from "../components/Text";

import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import PhrfContext from "../context/PhrfContext";

let listItemHeight = 0;

function ComparePHRF(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const resultListRef = useRef();

  const {
    getBoats,
    getElapsedDiff,
    secondsToHms,
    isAlternatePHRF,
  } = useContext(PhrfContext);

  const handleOnSelectedBoat = (item) => {
    updateBoatList(item);
  };

  const handleBoatItemClicked = (item) => {
    updateBoatList(item.boat);
  };

  const updateBoatList = (item) => {
    setSelectedBoat(item);
    setBoatResultsList(
      getElapsedDiff(boatSelectList, item.rating, 3600, isAlternatePHRF)
    );
  };

  useEffect(() => {
    selectedBoat && updateBoatList(selectedBoat);
  }, [isAlternatePHRF]);

  useEffect(() => {
    setBoatSelectList(getBoats().sort((a, b) => (a.name > b.name ? 1 : -1)));
  }, []);

  useEffect(() => {
    if (!selectedBoat) return;

    const indexOfSelectedBoat = boatResultsList.findIndex(
      (item) => item.boat.name === selectedBoat.name
    );

    resultListRef &&
      resultListRef.current.scrollToIndex({
        animated: true,
        index: indexOfSelectedBoat,
      });
  }, [selectedBoat]);

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Time Comparisons</Text>
      <Picker
        icon="sail-boat"
        placeholder="Select Reference Boat"
        items={boatSelectList}
        selectedItem={selectedBoat}
        onSelectItem={handleOnSelectedBoat}
      />
      <FlatList
        ref={resultListRef}
        data={boatResultsList}
        getItemLayout={(_, index) => {
          return {
            length: listItemHeight,
            offset: listItemHeight * index,
            index,
          };
        }}
        keyExtractor={(resultItem) => resultItem.boat.name}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <ListItem
            name="Boat"
            rating="Rating"
            correctedTime="Corrected Time"
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
              <ListItem
                name={item.boat.name}
                rating={item.boat.rating}
                correctedTime={secondsToHms(item.diff)}
                isSelectedItem={selectedBoat && selectedBoat === item.boat}
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
    backgroundColor: "#fff",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 28,
  },
  header: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 24,
  },
});

export default ComparePHRF;
