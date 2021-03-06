import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import Text from "./Text";
import defaultStyles from "../config/styles";

function PickerItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={[defaultStyles.text, styles.text]}>{item.boatName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
  },
  text: {
    padding: 14,
  },
});

export default PickerItem;
