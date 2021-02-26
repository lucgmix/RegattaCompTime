import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { useStorage } from "../context/StorageContext";
import BoatRaceListItem from "../components/lists/BoatRaceListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";

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
  const { storeBoatList, getBoatList } = useStorage();

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

  useEffect(() => {
    populateBoatList();
  }, []);

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Race" onHelpPress={handleHelpPress} />
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
