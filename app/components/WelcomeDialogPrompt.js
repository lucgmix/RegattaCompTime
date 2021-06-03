import React, { useState } from "react";
import { Image, View, StyleSheet, Dimensions, ScrollView } from "react-native";
// import { Overlay } from "react-native-elements";
import Text from "./Text";
import Button from "./Button";
import defaultStyles from "../config/styles";
import CheckBox from "react-native-check-box";
import {
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import Overlay from "react-native-modal-overlay";

const appIcon = require("../assets/logo.png");

function WelcomeDialogPrompt({
  title,
  message,
  content,
  positive,
  onPositiveButtonPress,
  isVisible = false,
}) {
  const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);

  const windowWidth = Dimensions.get("window").width - 160;
  const windowHeight = Dimensions.get("window").height;
  const iconSize = 24;

  const handleDontShowAgain = () => {
    setDontShowAgainChecked(!dontShowAgainChecked);
  };

  return (
    <Overlay
      visible={isVisible}
      animationType="zoomIn"
      containerStyle={{
        backgroundColor: defaultStyles.colors.semiTransparentGray,
        padding: 12,
      }}
      childrenWrapperStyle={{
        backgroundColor: defaultStyles.colors.white,
        padding: 0,
      }}
      animationDuration={500}
    >
      {/* <ScrollView> */}
      <Image style={styles.smallLogo} source={appIcon} />
      <Text style={styles.title}>{title}</Text>

      {/* {message && <Text style={styles.message}>{message}</Text>} */}
      {/* {content && <Text style={styles.content}>{content}</Text>} */}
      <Text style={styles.message}>
        Regatta Comp Time allows you to quickly compare boat results after a
        race. Use Time Delta section for time differences based on boat's
        ratings. Use the Race section to track boat's compensated/corrected time
        in "Real Time".
      </Text>

      <View style={styles.sectionContent}>
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
          width={windowWidth}
          message={`Displays the Help of a Section. `}
        />
      </View>

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

      <View style={styles.buttonContainer}>
        {positive && (
          <Button
            buttonStyle={styles.button}
            title={positive}
            onPress={onPositiveButtonPress}
          />
        )}
      </View>
      {/* </ScrollView> */}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container(width, height) {
    return {
      marginTop: 64,
      width: width,
      height: height,
      backgroundColor: defaultStyles.colors.white,
    };
  },
  checkbox: {
    right: 0,
    marginLeft: 24,
    marginRight: 4,
    justifyContent: "center",
    alignSelf: "center",
  },
  checkboxText: {
    color: "red",
  },
  scrollviewContainer: {},
  content: {
    alignSelf: "center",
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: defaultStyles.colors.transparent,
  },
  button: { minWidth: 100, margin: 4, marginTop: 24, marginBottom: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "center" },
  title: {
    // marginTop: Platform.OS === "ios" ? 24 : -18,
    marginTop: 8,
    justifyContent: "center",
    alignSelf: "center",
    color: defaultStyles.colors.primary,
    fontWeight: "600",
    fontSize: 24,
  },
  message: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 14,
    marginTop: 8,
    fontSize: 14,
  },
  smallLogo: {
    marginTop: 16,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
  },
  sectionContent: {
    width: 180,
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginTop: 8,
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
      margin: 4,
      marginLeft: 8,
      width: width,
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
