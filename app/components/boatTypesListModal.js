import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import Screen from "./Screen";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import boatTypesList from "../config/boatTypesList.json";
import defaultStyles from "../config/styles";
import { useWindowDimensions } from "react-native";

function BoatTypesListModal({
  buttonTitle,
  isModalVisible,
  onModalButtonPress,
  onBoatTypeChange,
}) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState();
  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    const boatTypeItems = boatTypesList.boatTypeList.map((item) => {
      return {
        id: item.id,
        label: item.boatType,
        value: JSON.stringify(item),
      };
    });
    setItems(boatTypeItems);
  }, []);

  useEffect(() => {
    value && onBoatTypeChange(value);
  }, [value]);

  return (
    <Modal visible={isModalVisible} animationType="fade">
      <Screen>
        <View style={styles.container}>
          <Button
            title={buttonTitle}
            onPress={onModalButtonPress}
            buttonStyle={{ width: 80, alignSelf: "center", marginBottom: 24 }}
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setValue={setValue}
            setItems={setItems}
            setOpen={setOpen}
            value={value}
            maxHeight={windowHeight}
            key="id"
            placeholder="Select Boat Class"
            searchPlaceholder="Type a Boat Class"
            schema={{
              label: "label",
              value: "value",
              selectable: "selectable",
            }}
            searchable={true}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            searchContainerStyle={{
              borderBottomColor: defaultStyles.colors.mediumlight,
            }}
            searchTextInputStyle={{
              color: defaultStyles.colors.subText,
              borderColor: defaultStyles.colors.mediumt,
              borderRadius: 4,
            }}
          />
        </View>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  dropdown: {
    backgroundColor: defaultStyles.colors.light,
    borderWidth: 0,
  },
  dropdownContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.mediumlight,
  },
});

export default BoatTypesListModal;
