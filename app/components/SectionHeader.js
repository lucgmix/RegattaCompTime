import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../components/Text";
import defaultStyles from "../config/styles";
import { Ionicons } from "@expo/vector-icons";

function SectionHeader({ title, onHelpPress, helpVisible = true }) {
  return (
    <View style={[styles.container, !helpVisible && styles.helpNotVisible]}>
      {helpVisible && <View style={styles.spacer}></View>}
      <Text style={[styles.headerText]}>{title}</Text>
      {helpVisible && (
        <View style={styles.helpIcon}>
          <TouchableOpacity onPress={onHelpPress}>
            <Ionicons
              name="ios-help-circle-outline"
              size={24}
              color={defaultStyles.colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    height: 40,
  },
  helpNotVisible: {
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: defaultStyles.colors.primary,
  },
  helpIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 40,
    height: 40,
  },
});

export default SectionHeader;
