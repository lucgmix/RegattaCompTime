import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import Picker from "../components/Picker";
import Screen from "../components/Screen";
import Text from "../components/Text";

import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import PhrfContext from "../context/PhrfContext";

import InputSpinner from "react-native-input-spinner";
import colors from "../config/colors";

function ComparePHRF(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatList, setBoatList] = useState();
  const [boatResultsList, setBoatResultsList] = useState();
  const [myTextValue, setMyTextValue] = useState();

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
      <Text style={styles.header}>Time Comparisons</Text>
      <TextInput
        editable
        keyboardType="numeric"
        value={myTextValue}
        onChangeText={(value) =>
          value.match(/[0-9]*/gm) && setMyTextValue(value)
        }
      />
      <View style={styles.spinnerContainer}>
        <InputSpinner
          style={styles.spinner}
          buttonStyle={styles.spinnerButton}
          max={60}
          min={0}
          step={1}
          value={48}
          onChange={(num) => {
            console.log(num);
          }}
          showBorder
          rounded={false}
        />
      </View>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 5, paddingTop: 30 },
  header: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  spinner: {
    backgroundColor: "white",
  },
  spinnerButton: {
    height: 50,
    backgroundColor: colors.medium,
  },
  spinnerContainer: {
    height: 50,
    width: 150,
  },
});

export default ComparePHRF;
