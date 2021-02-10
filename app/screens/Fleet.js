import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import BoatCreator from "./BoatCreator";
import { ScrollView } from "react-native-gesture-handler";
import BoatListItem from "../components/lists/BoatListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { useData } from "../context/DataContext";

let listItemHeight = 0;

function arrayRemove(arr, value) {
  return arr.filter((boat) => boat.id != value.id);
}

function Fleet(props) {
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isCreateBoatModalVisible, setIsCreateBoatModalVisible] = useState(
    false
  );
  const { boatList, storeBoatList } = useData();
  const boatListRef = useRef();

  const handleBoatItemClicked = (item) => {
    setSelectedBoat(item);
  };

  const handleAddBoatButtonPress = () => {
    setSelectedBoat(null);
    setIsCreateBoatModalVisible(true);
  };

  const handleEditBoatButtonPress = () => {
    setIsCreateBoatModalVisible(true);
  };

  const handleDeleteBoatButtonPress = () => {
    const removedBoatArray = arrayRemove(boatList, selectedBoat);
    storeBoatList(removedBoatArray).then(setSelectedBoat(null));
  };

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Fleet" />
      <View style={styles.buttonContainer}>
        <Button title="Add Boat" onPress={handleAddBoatButtonPress} />
        <Button
          disabled={!selectedBoat}
          buttonStyle={styles.editBoatButton}
          title="Edit Boat"
          onPress={handleEditBoatButtonPress}
        />
        <Button
          disabled={!selectedBoat}
          buttonStyle={styles.editBoatButton}
          title="Delete Boat"
          onPress={handleDeleteBoatButtonPress}
        />
      </View>
      <FlatList
        ref={boatListRef}
        data={boatList}
        getItemLayout={(_, index) => {
          return {
            length: listItemHeight,
            offset: listItemHeight * index,
            index,
          };
        }}
        keyExtractor={(boatItem) => boatItem.id}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <BoatListItem
            name="Boat"
            type="Type"
            ratingFS="HR-FS"
            ratingNFS="HR-NFS"
            defaultRating="FS/NFS"
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
              <BoatListItem
                name={item.boatName}
                ratingFS={item.ratingFS}
                ratingNFS={item.ratingNFS}
                type={item.boatType}
                defaultRating={item.defaultRating}
                isSelectedItem={selectedBoat && selectedBoat.id === item.id}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
      <Modal visible={isCreateBoatModalVisible} animationType="fade">
        <ScrollView>
          <BoatCreator
            isModalVisible={isCreateBoatModalVisible}
            onModalButtonPress={() => setIsCreateBoatModalVisible(false)}
            selectedBoat={selectedBoat}
          />
        </ScrollView>
      </Modal>
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  editBoatButton: {
    marginLeft: 8,
  },
});

export default Fleet;
