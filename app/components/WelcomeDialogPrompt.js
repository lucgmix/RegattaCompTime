import React, { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Text from "./Text";
import Button from "./Button";
import defaultStyles from "../config/styles";
import CheckBox from "react-native-check-box";

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

  const handleDontShowAgain = () => {
    setDontShowAgainChecked(!dontShowAgainChecked);
  };

  return (
    <Overlay fullScreen={false} isVisible={isVisible}>
      <Image style={styles.smallLogo} source={appIcon} />
      <Text style={styles.title}>{title}</Text>

      {message && <Text style={styles.message}>{message}</Text>}
      {content && <Text style={styles.content}>{content}</Text>}

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
    </Overlay>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignSelf: "center",
    margin: 16,
    marginTop: 24,
  },
  smallLogo: {
    marginTop: 8,
    height: 80,
    resizeMode: "contain",
  },
});

export default WelcomeDialogPrompt;
