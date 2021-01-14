import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Modal,
} from "react-native";
import Picker from "../components/Picker";
import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";
import TimeInput from "../components/TimeInput";

import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import PhrfContext from "../context/PhrfContext";

import colors from "../config/colors";

let listItemHeight = 0;

function ComparePHRF(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [boatSelectList, setBoatSelectList] = useState([]);
  const [boatResultsList, setBoatResultsList] = useState([]);
  const [raceDuration, setRaceDuration] = useState(3600);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
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
      getElapsedDiff(boatSelectList, item.rating, raceDuration, isAlternatePHRF)
    );
  };

  useEffect(() => {
    selectedBoat && updateBoatList(selectedBoat);
  }, [isAlternatePHRF, raceDuration]);

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

  const onRaceDurationChanged = (time) => {
    setRaceDuration(time);
  };

  const handleSetRaceDuration = () => {
    setIsTimeModalVisible(true);
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}>Time Delta</Text>
      <View style={styles.labelContainer}>
        <Text>Race Duration {secondsToHms(raceDuration)}</Text>
        <Button title="Set" onPress={handleSetRaceDuration}></Button>
      </View>
      <Modal visible={isTimeModalVisible} animationType="fade">
        <Screen>
          <View style={styles.timeModalContainer}>
            <TimeInput
              duration={raceDuration}
              onDurationChange={onRaceDurationChanged}
            />
            <Button
              title="Done"
              onPress={() => setIsTimeModalVisible(false)}
            ></Button>
          </View>
        </Screen>
      </Modal>

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
    paddingTop: 16,
  },
  header: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    backgroundColor: colors.light,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeModalContainer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ComparePHRF;
