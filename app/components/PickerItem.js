import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import Text from "./Text";
import defaultStyles from "../config/styles";

function PickerItem({ item, index, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container(index)}>
        <Text style={styles.text}>{item.boatName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: (indexValue) => ({
    backgroundColor:
      indexValue % 2 === 0
        ? defaultStyles.colors.primary300
        : defaultStyles.colors.primary100,
  }),
  text: {
    padding: 14,
  },
});

export default PickerItem;
