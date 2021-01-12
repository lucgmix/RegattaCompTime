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
  const [boatList, setBoatList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const resultListRef = useRef();

  const {
    getBoats,
    getElapsedDiff,
    secondsToHms,
    isAlterNatePHRF,
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
      getElapsedDiff(boatList, item.rating, 3600, isAlterNatePHRF)
    );
  };

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

  useEffect(() => {
    setBoatList(getBoats().sort((a, b) => (a.name > b.name ? 1 : -1)));
  }, []);

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Time Comparisons</Text>
      <Picker
        icon="sail-boat"
        placeholder="Select Boat"
        items={boatList}
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
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              listItemHeight = height;
            }}
          >
            <ListItem
              name="Boat"
              rating="Rating"
              correctedTime="Corrected Time"
              isHeader
            />
          </View>
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handleBoatItemClicked(item)}>
            <View>
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
    marginBottom: 20,
  },
});

export default ComparePHRF;
