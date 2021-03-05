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
import { useStorage } from "../context/StorageContext";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DialogPrompt from "../components/DialogPrompt";
import { BOAT_CREATOR_MODE } from "./BoatCreator";
import { v4 as uuidv4 } from "uuid";

import defaultStyles from "../config/styles";

let listItemHeight = 0;

function arrayRemove(arr, value) {
  return arr.filter((boat) => boat.id != value.id);
}

function sortBoatArray(boatList) {
  return Array.from(boatList).sort((a, b) => {
    if (a.rating === b.rating) {
      return a.boatName > b.boatName ? 1 : -1;
    } else {
      return a.rating > b.rating ? 1 : -1;
    }
  });
}

function Fleet(props) {
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isCreateBoatModalVisible, setIsCreateBoatModalVisible] = useState(
    false
  );
  const [boatCreatorMode, setBoatCreatorMode] = useState();
  const [viewBoatList, setViewBoatList] = useState([]);
  const { storeBoatList, getBoatList } = useStorage();
  const boatListRef = useRef();

  const [promptVisible, setPromptVisible] = useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);

  const updateFleetWithBoat = () => {
    setIsCreateBoatModalVisible(false);
    populateBoatList();
  };

  const toggleDeleteConfirmPrompt = () => {
    setPromptVisible(!promptVisible);
  };

  const handleBoatItemClicked = (item) => {
    setSelectedBoat(item);
  };

  const handleAddBoatButtonPress = () => {
    setBoatCreatorMode(BOAT_CREATOR_MODE.ADD);
    setSelectedBoat(null);
    setIsCreateBoatModalVisible(true);
  };

  const handleEditBoatButtonPress = () => {
    setBoatCreatorMode(BOAT_CREATOR_MODE.UPDATE);
    setIsCreateBoatModalVisible(true);
  };

  const handleDuplicateBoatButtonPress = () => {
    getBoatList().then(({ data }) => {
      const boatList = data;
      const selectedBoatCopy = {
        ...selectedBoat,
        boatName: `${selectedBoat.boatName} Copy`,
        id: uuidv4(),
      };
      boatList.push(selectedBoatCopy);

      storeBoatList(boatList).then((result) => {
        if (result.ok) {
          populateBoatList();
        } else {
          // Error prompt here?
        }
      });
    });
  };

  const handleDeleteBoatButtonPress = (boat) => {
    toggleDeleteConfirmPrompt();
  };

  const handleConfirmDeleteBoat = () => {
    const removedBoatArray = arrayRemove(viewBoatList, selectedBoat);
    storeBoatList(removedBoatArray).then((result) => {
      if (result.ok) {
        setSelectedBoat(null);
        toggleDeleteConfirmPrompt();
        populateBoatList();
      } else {
        // Error prompt here?
      }
    });
  };

  const handleHelpPress = () => {
    setHelpPromptVisible(true);
  };

  const populateBoatList = () => {
    getBoatList().then(({ data }) => {
      setViewBoatList(sortBoatArray(data));
      selectedBoat &&
        setSelectedBoat(data.find((boat) => boat.id === selectedBoat.id));
    });
  };

  useEffect(() => {
    populateBoatList();
  }, []);

  return (
    <Screen style={styles.container}>
      {selectedBoat && (
        <DialogPrompt
          title="Delete Boat"
          message="Are you sure you want to delete this boat?"
          content={`${selectedBoat.boatType} ${selectedBoat.boatName}`}
          positive="Yes"
          neutral="No"
          isVisible={promptVisible}
          onNeutralButtonPress={toggleDeleteConfirmPrompt}
          onPositiveButtonPress={handleConfirmDeleteBoat}
        />
      )}

      <DialogPrompt
        title="Fleet Help"
        message="The Fleet section is were you manage the boats that will be used in the Time Delta and Race sections."
        content={`Use the Add, Edit, Duplicate or Delete button to manage the boats of the fleet.\n\nTip: To Edit, Duplicate or Delete a boat, you first need to select it in the list by clicking on it.`}
        positive="Got it"
        isVisible={helpPromptVisible}
        onPositiveButtonPress={() => setHelpPromptVisible(false)}
      />

      <SectionHeader title="Fleet" onHelpPress={handleHelpPress} />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          <Button
            buttonStyle={styles.buttonStyleLeft}
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
            buttonStyle={styles.buttonStyleLeft}
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
        </View>
        <View style={styles.buttonGroup}>
          <Button
            buttonStyle={styles.buttonStyleRight}
            disabled={!selectedBoat}
            title="Duplicate"
            onPress={handleDuplicateBoatButtonPress}
            icon={
              <MaterialCommunityIcons
                name="content-duplicate"
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
            buttonStyle={styles.buttonStyleRight}
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
            onSubmitButtonPress={updateFleetWithBoat}
            selectedBoat={selectedBoat}
            viewMode={boatCreatorMode}
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

export default Fleet;
