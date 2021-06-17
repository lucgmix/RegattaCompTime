import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../components/Text";
import defaultStyles from "../config/styles";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import Button from "../components/Button";

function SectionHeader({
  title,
  onEmailPress,
  onHelpPress,
  emailVisible = false,
  emailEnabled = false,
  helpVisible = true,
}) {
  return (
    <View style={[styles.container, !helpVisible && styles.helpNotVisible]}>
      {helpVisible && <View style={styles.spacer}></View>}
      <Text style={[styles.headerText]}>{title}</Text>
      <View style={styles.rightButtonsContainer}>
        {emailVisible && (
          <TouchableOpacity disabled={!emailEnabled} onPress={onEmailPress}>
            <View style={styles.emailButton}>
              <Fontisto
                name="paper-plane"
                size={20}
                color={
                  emailEnabled
                    ? defaultStyles.colors.primary
                    : defaultStyles.colors.disabledText
                }
              />
            </View>
          </TouchableOpacity>
        )}
        {helpVisible && (
          <Button
            onPress={onHelpPress}
            buttonStyle={{
              justifyContent: "flex-end",
              backgroundColor: defaultStyles.colors.light,
            }}
            icon={
              <Ionicons
                name="ios-help-circle-outline"
                size={24}
                color={defaultStyles.colors.primary}
              />
            }
          />
        )}
      </View>
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
  rightButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
  },
  emailButton: {
    minWidth: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export default SectionHeader;
