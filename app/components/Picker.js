import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "./Text";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import Button from "../components/Button";
import Screen from "./Screen";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { isEmpty } from "lodash";

function Picker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  PickerItemComponent = PickerItem,
  placeholder,
  selectedItem,
  width = "100%",
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => setModalVisible(true)}
        disabled={isEmpty(items)}
      >
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={defaultStyles.colors.primary}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <Text style={[defaultStyles.text, styles.text]}>
              {selectedItem.boatName}
            </Text>
          ) : (
            <Text style={[defaultStyles.text, styles.placeholde]}>
              {placeholder}
            </Text>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={defaultStyles.colors.primary}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="fade">
        <Screen>
          <Button
            buttonStyle={styles.doneButton}
            title="Done"
            onPress={() => setModalVisible(false)}
          ></Button>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <ListItemSeparator />}
            numColumns={numberOfColumns}
            renderItem={({ item, index }) => (
              <PickerItemComponent
                item={item}
                index={index}
                label={item.boatName}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 8,
    flexDirection: "row",
    padding: 12,
    marginVertical: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  doneButton: {
    marginTop: 12,
    marginBottom: 24,
    maxWidth: 80,
    alignSelf: "center",
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    flex: 1,
    fontWeight: "400",
    marginLeft: 4,
    paddingTop: 2,
    alignItems: "center",
  },
});

export default Picker;
