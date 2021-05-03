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
import { applyBoldStyle } from "../utils/stringStyle";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import BoatListItem from "../components/lists/BoatListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { useStorage } from "../context/StorageContext";
import { usePHRF } from "../context/PhrfContext";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DialogPrompt from "../components/DialogPrompt";
import BoatCreator, { BOAT_CREATOR_MODE } from "./BoatCreator";
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

function Fleet() {
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isCreateBoatModalVisible, setIsCreateBoatModalVisible] = useState(
    false
  );
  const [boatCreatorMode, setBoatCreatorMode] = useState();
  const [viewBoatList, setViewBoatList] = useState([]);
  const { storeBoatList, getBoatList, boatDataChanged } = useStorage();
  const boatListRef = useRef();

  const [promptVisible, setPromptVisible] = useState(false);
  const [helpPromptVisible, setHelpPromptVisible] = useState(false);

  const { ratingOverride } = usePHRF();

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
    getBoatList().then(({ boatData: boatList }) => {
      const selectedBoatCopy = {
        ...selectedBoat,
        boatName: `${selectedBoat.boatName} Copy`,
        id: uuidv4(),
      };
      boatList.push(selectedBoatCopy);

      storeBoatList(boatList).then((result) => {
        if (result.ok) {
          populateBoatList(boatList);
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

  const populateBoatList = (boatList) => {
    if (boatList) {
      setBoatList(boatList);
    } else {
      getBoatList().then(({ boatData }) => {
        setBoatList(boatData);
      });
    }
  };

  const updateBoatList = () => {
    getBoatList().then(({ boatData }) => {
      setBoatList(boatData);
    });
  };

  const setBoatList = (boatData) => {
    setViewBoatList(sortBoatArray(boatData));
    selectedBoat &&
      setSelectedBoat(boatData.find((boat) => boat.id === selectedBoat.id));
  };

  const getFleetHelpString = (tag) => {
    let textToStyle;
    switch (tag) {
      case "message":
        textToStyle = {
          sentence: `The {0} section is where you manage the boats that will be used in the Time Delta and Race sections.`,
          boldText: ["Fleet"],
        };
        break;
      case "content":
        textToStyle = {
          sentence: `Use the {0}, {1}, {2} or {3} buttons to manage the boats of the fleet.\n\nTip: To Edit, Duplicate or Delete a boat, you first need to select it in the list by clicking on it.`,
          boldText: ["Add", "Edit", "Duplicate", "Delete"],
        };
        break;
    }

    return applyBoldStyle(textToStyle);
  };

  useEffect(() => {
    populateBoatList();
    return () => {
      setBoatList([]);
    };
  }, [boatDataChanged]);

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
        message={getFleetHelpString("message")}
        content={getFleetHelpString("content")}
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
            type="Class"
            ratingFS="FS"
            ratingNFS="NFS"
            ratingOverride={ratingOverride}
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
                ratingError={item.ratingError}
                type={item.boatType}
                defaultRating={item.defaultRating}
                ratingOverride={item.ratingOverride}
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
