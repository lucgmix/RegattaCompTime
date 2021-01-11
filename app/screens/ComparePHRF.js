import React, { useContext, useEffect, useState } from "react";
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
import PhrfContext from "../context/PhrfContext";

function ComparePHRF(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatList, setBoatList] = useState();
  const [boatResultsList, setBoatResultsList] = useState();

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
    setBoatList(getBoats().sort((a, b) => (a.name > b.name ? 1 : -1)));
  }, []);

  return (
    <Screen style={styles.container}>
      <Text>Corrected Time Comparisons</Text>
      <Picker
        icon="sail-boat"
        placeholder="Select Boat"
        items={boatList}
        selectedItem={selectedBoat}
        onSelectItem={handleOnSelectedBoat}
      />
      <FlatList
        data={boatResultsList}
        keyExtractor={(resultItem) => resultItem.boat.name}
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
  container: { backgroundColor: "#fff", padding: 5, paddingTop: 30 },
});

export default ComparePHRF;
