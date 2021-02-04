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

let listItemHeight = 0;

function Fleet(props) {
  const [selectedBoat, setSelectedBoat] = useState();
  const [isCreateBoatModalVisible, setIsCreateBoatModalVisible] = useState(
    false
  );
  const [boatList, setBoatList] = useState([]);
  const { getBoatList } = useData();
  const boatListRef = useRef();

  const handleBoatItemClicked = (item) => {
    setSelectedBoat(item);
    console.log("handleBoatItemClicked", item);
  };

  const handleAddBoatButtonPress = () => {
    setSelectedBoat(null);
    setIsCreateBoatModalVisible(true);
  };

  const handleEditBoatButtonPress = () => {
    setIsCreateBoatModalVisible(true);
  };

  useEffect(() => {
    getBoatList().then((boatList) => {
      console.log(boatList);
      setBoatList(boatList);
    });
  }, []);

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Fleet" />
      <View style={styles.buttonContainer}>
        <Button title="Add Boat" onPress={handleAddBoatButtonPress} />
        <Button
          disabled={selectedBoat === null}
          buttonStyle={styles.editBoatButton}
          title="Edit Boat"
          onPress={handleEditBoatButtonPress}
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
        keyExtractor={(boatItem) => boatItem.name}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        ListHeaderComponent={() => (
          <BoatListItem
            name="Boat"
            type="Type"
            rating_fs="Rating FS"
            rating_nfs="Rating NFS"
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
                name={item.name}
                rating={item.rating}
                type={item.type}
                isSelectedItem={selectedBoat && selectedBoat === item}
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  editBoatButton: {
    marginLeft: 8,
  },
});

export default Fleet;
