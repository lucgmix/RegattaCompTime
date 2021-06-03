import React, { useState } from "react";
import { Image, Dimensions, View, ScrollView, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Text from "./Text";
import Button from "./Button";
import { Dialog } from "react-native-paper";
import defaultStyles from "../config/styles";
import Screen from "./Screen";
import {
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import CheckBox from "react-native-check-box";

const appIcon = require("../assets/logo.png");
const iconSize = 24;

function WelcomeDialogPrompt({
  title,
  positive,
  onPositiveButtonPress,
  isVisible = false,
}) {
  const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);

  const windowWidth = Dimensions.get("window").width - 160;

  const handleDontShowAgain = () => {
    setDontShowAgainChecked(!dontShowAgainChecked);
  };

  return (
    <Overlay isVisible={isVisible}>
      <Screen>
        <View style={styles.container}>
          <Image style={styles.smallLogo} source={appIcon} />
          <Text style={styles.title}>{title}</Text>

          <Dialog.ScrollArea contentContainerStyle={{ marginLeft: 0 }}>
            <ScrollView contentContainerStyle={styles.scrollviewContainer}>
              <Text style={styles.message}>
                Regatta Comp Time allows you to quickly compare boat results
                after a race. Use Time Delta section for time differences based
                on boat's ratings. Use the Race section to track boat's
                compensated/corrected time in "Real Time".
              </Text>

              <SectionHelp
                icon={
                  <MaterialCommunityIcons
                    name="sail-boat"
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                iconLabel="Fleet"
                message={`The Fleet section is where you manage the boats that will be used in the Time Delta and Race sections.`}
                width={windowWidth}
              />

              <SectionHelp
                icon={
                  <Entypo
                    name="stopwatch"
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                iconLabel="Time Delta"
                message={`The Time Delta section is were you can compare the compensated time difference between boats in the Fleet based on the race duration of your boat.`}
                width={windowWidth}
              />

              <SectionHelp
                icon={
                  <Feather
                    name="flag"
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                iconLabel="Race"
                message={`The Race section allows you to track realtime results (Corrected Time and Elapsed race time) of boats in the Fleet.`}
                width={windowWidth}
              />

              <SectionHelp
                icon={
                  <Feather
                    name={"settings"}
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                iconLabel="Settings"
                message={`The Settings section allows you to apply global parameters that will affect all sections.`}
                width={windowWidth}
              />
              <SectionHelp
                icon={
                  <Ionicons
                    name="ios-help-circle-outline"
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                message={`Displays the Help of a Section. `}
                width={windowWidth}
              />
            </ScrollView>
          </Dialog.ScrollArea>

          <View style={styles.buttonContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 4,
                marginTop: 16,
              }}
            >
              <CheckBox
                style={styles.checkbox}
                isChecked={dontShowAgainChecked}
                onClick={handleDontShowAgain}
                checkBoxColor={defaultStyles.colors.primary}
              />
              <Text>Don't show again</Text>
            </View>
            {positive && (
              <Button
                buttonStyle={styles.button}
                title={positive}
                onPress={onPositiveButtonPress}
              />
            )}
          </View>
        </View>
      </Screen>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    backgroundColor: defaultStyles.colors.transparent,
  },
  scrollviewContainer: { paddingBottom: 16 },
  content: {
    alignSelf: "center",
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: defaultStyles.colors.transparent,
  },
  button: { minWidth: 100, margin: 4, marginTop: 16 },
  buttonContainer: { justifyContent: "center", alignItems: "center" },
  title: {
    justifyContent: "center",
    alignSelf: "center",
    color: defaultStyles.colors.primary,
    fontWeight: "600",
    fontSize: 18,
  },
  message: { marginTop: 16 },
  smallLogo: {
    marginTop: 8,
    marginBottom: 8,
    width: 70,
    height: 70,
    resizeMode: "contain",
    alignSelf: "center",
  },
  checkbox: {
    right: 0,
    marginRight: 4,
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default WelcomeDialogPrompt;

export function SectionHelp({ icon, iconLabel, message, width }) {
  const iconSize = 28;

  return (
    <View style={sectionStyles.container(width)}>
      <View style={sectionStyles.iconContainer}>
        {icon}
        <Text style={sectionStyles.iconLabel}>{iconLabel}</Text>
      </View>
      <Text style={sectionStyles.message}>{message}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container(width) {
    return {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: width,
      marginTop: 8,
    };
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconLabel: {
    marginLeft: 4,
    marginTop: 5,
    color: defaultStyles.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  message: { marginTop: 5, marginLeft: 8, fontSize: 14 },
});
