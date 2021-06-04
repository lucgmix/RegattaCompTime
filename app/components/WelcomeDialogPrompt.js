import React, { useEffect, useState } from "react";
import { Animated, Image, View, ScrollView, StyleSheet } from "react-native";
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
import { useStorage } from "../context/StorageContext";
import { WELCOME_SCREEN_KEY } from "../config/constants";

const appIcon = require("../assets/logo.png");
const iconSize = 24;

function WelcomeDialogPrompt({
  title,
  positive,
  onPositiveButtonPress,
  onDontShowAgainClick,
  isVisible = false,
}) {
  const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);
  const { getValueForKey } = useStorage();

  const handleDontShowAgain = () => {
    setDontShowAgainChecked(!dontShowAgainChecked);
    onDontShowAgainClick(!dontShowAgainChecked);
  };

  useEffect(() => {
    getValueForKey(WELCOME_SCREEN_KEY).then((response) => {
      if (response.ok && response.data) {
        setDontShowAgainChecked(response.data);
      }
    });
  }, []);

  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.overlay}>
      <Screen>
        <View style={styles.container}>
          <Image style={styles.smallLogo} source={appIcon} />
          <Text style={styles.title}>{title}</Text>

          <Dialog.ScrollArea contentContainerStyle={{ marginLeft: 0 }}>
            <ScrollView contentContainerStyle={styles.scrollviewContainer}>
              <Text style={styles.message}>
                Regatta Comp Time allows you to quickly compare boat results
                during or after a race using the PHRF-LO handicap ratings. Use
                Time Delta section to compare time differences based on race
                duration. Use the Race section to track compensated/corrected
                time in "Real Time" of the boats in the fleet.
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
                message={`The Fleet section is where you manage the boats (Add, Edit, Duplicate, Delete) that will be used in the Time Delta and Race sections.`}
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
                message={`The Time Delta section is were you can compare the compensated/corrected time difference between boats in the Fleet based on the race duration of your boat.`}
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
                message={`The Race section allows you to track results (Corrected Time and Elapsed race time) of boats in the Fleet in real time.`}
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
                message={`The Settings section allows you to apply global parameters that will affect all sections, such as PHRF Rating Overrride, PHRF-LO Formula. More options are also availiable. `}
              />
              <SectionHelp
                icon={
                  <Ionicons
                    name="ios-help-circle-outline"
                    size={iconSize}
                    color={defaultStyles.colors.primary}
                  />
                }
                iconLabel="Help"
                message={`Screens that have this icon at the top right have help details you should consult. `}
              />
            </ScrollView>
          </Dialog.ScrollArea>

          <View style={styles.buttonContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
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
    backgroundColor: defaultStyles.colors.transparent,
    marginTop: Platform.OS === "ios" ? 16 : 0,
    padding: 0,
  },
  scrollviewContainer: { paddingBottom: 16 },
  content: {
    alignSelf: "center",
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: defaultStyles.colors.transparent,
  },
  button: { minWidth: 100, marginTop: 16, marginBottom: 16 },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    justifyContent: "center",
    alignSelf: "center",
    color: defaultStyles.colors.primary,
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 4,
  },
  message: { marginTop: 16 },
  smallLogo: {
    marginBottom: 4,
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
  overlay: {
    padding: 0,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: Platform.OS === "ios" ? 80 : 56,
    marginTop: Platform.OS === "ios" ? 48 : 24,
  },
});

export default WelcomeDialogPrompt;

export function SectionHelp({ icon, iconLabel, message, width }) {
  const iconSize = 28;

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.iconContainer}>
        {icon}
        <Text style={sectionStyles.iconLabel}>{iconLabel}</Text>
      </View>
      <Text style={sectionStyles.message}>{message}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 12,
    marginRight: 116,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconLabel: {
    marginLeft: 4,
    color: defaultStyles.colors.primary,
    fontWeight: "600",
  },
  message: { marginTop: 3, marginLeft: 12, fontSize: 14 },
});
