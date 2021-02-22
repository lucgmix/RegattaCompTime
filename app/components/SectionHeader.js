import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../components/Text";
import defaultStyles from "../config/styles";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";

function SectionHeader({ title, onHelpPress, helpVisible = true }) {
  return (
    <View style={[styles.container, !helpVisible && styles.helpNotVisible]}>
      {helpVisible && <View style={styles.spacer}></View>}
      <Text style={[styles.headerText]}>{title}</Text>
      {helpVisible && (
        <View style={styles.helpButton}>
          <Button
            type="clear"
            onPress={onHelpPress}
            buttonStyle={{ justifyContent: "flex-end" }}
            icon={
              <Ionicons
                name="ios-help-circle-outline"
                size={24}
                color={defaultStyles.colors.primary}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  helpNotVisible: {
    justifyContent: "center",
  },
  headerText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    color: defaultStyles.colors.primary,
  },
  helpButton: {
    position: "absolute",
    right: 0,
  },
});

export default SectionHeader;
