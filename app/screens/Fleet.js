import React, { useEffect, useRef, useState } from "react";
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
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DialogPrompt from "../components/DialogPrompt";

import defaultStyles from "../config/styles";

let listItemHeight = 0;

function arrayRemove(arr, value) {
  return arr.filter((boat) => boat.id != value.id);
}

function Fleet(props) {
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isCreateBoatModalVisible, setIsCreateBoatModalVisible] = useState(
    false
  );
  const [viewBoatList, setViewBoatList] = useState([]);
  const { boatList, storeBoatList } = useData();
  const boatListRef = useRef();

  const [promptVisible, setPromptVisible] = useState(false);

  const toggleDeleteConfirmPrompt = () => {
    console.trace();
    setPromptVisible(!promptVisible);
  };

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

  const handleDeleteBoatButtonPress = (boat) => {
    toggleDeleteConfirmPrompt();
  };

  const handleConfirmDeleteBoat = () => {
    const removedBoatArray = arrayRemove(boatList, selectedBoat);
    storeBoatList(removedBoatArray).then((result) => {
      if (result.ok) {
        setSelectedBoat(null);
        toggleDeleteConfirmPrompt();
      } else {
        // Error prompt here?
      }
    });
  };

  useEffect(() => {
    const sortedBoats = Array.from(boatList).sort((a, b) =>
      a.boatType > b.boatType ? 1 : -1
    );
    setViewBoatList(sortedBoats);
  }, [boatList]);

  return (
    <Screen style={styles.container}>
      {selectedBoat && (
        <DialogPrompt
          title="Delete Boat"
          message="Are you sure you want to delete this boat?"
          content={`${selectedBoat.boatType} ${selectedBoat.boatName}`}
          positive="OK"
          neutral="Cancel"
          isVisible={promptVisible}
          onNeutralButtonPress={toggleDeleteConfirmPrompt}
          onPositiveButtonPress={handleConfirmDeleteBoat}
        />
      )}
      <SectionHeader title="Fleet" />
      <View style={styles.buttonContainer}>
        <Button
          titleStyle={{ marginHorizontal: 8 }}
          title="Add"
          onPress={handleAddBoatButtonPress}
          icon={
            <Ionicons
              name="md-add-sharp"
              size={18}
              color={defaultStyles.colors.white}
            />
          }
        />
        <Button
          titleStyle={{ marginHorizontal: 8 }}
          disabled={!selectedBoat}
          title="Edit"
          onPress={handleEditBoatButtonPress}
          icon={
            <AntDesign
              name="edit"
              size={16}
              color={
                !selectedBoat
                  ? defaultStyles.colors.disabledText
                  : defaultStyles.colors.white
              }
            />
          }
        />
        <Button
          titleStyle={{ marginHorizontal: 8 }}
          disabled={!selectedBoat}
          title="Delete"
          onPress={handleDeleteBoatButtonPress}
          icon={
            <AntDesign
              name="delete"
              size={16}
              color={
                !selectedBoat
                  ? defaultStyles.colors.disabledText
                  : defaultStyles.colors.white
              }
            />
          }
        />
      </View>
      <FlatList
        ref={boatListRef}
        data={viewBoatList}
        getItemLayout={(_, index) => {
          return {
            length: listItemHeight,
            offset: listItemHeight * index,
            index,
          };
        }}
        keyExtractor={(boatItem) => {
          return boatItem.id;
        }}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <BoatListItem
            name="Boat"
            type="Type"
            ratingFS="FS"
            ratingNFS="NFS"
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
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Fleet;
