import React from "react";
import { View, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Text from "./Text";
import Button from "./Button";
import defaultStyles from "../config/styles";

function DialogPrompt({
  title,
  message,
  content,
  positive,
  neutral,
  negative,
  onPositiveButtonPress,
  onNeutralButtonPress,
  onNegativeButtonPress,
  isVisible = false,
}) {
  return (
    <Overlay isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        {content && <Text style={styles.content}>{content}</Text>}

        <View style={styles.buttonContainer}>
          {neutral && (
            <Button
              buttonStyle={styles.button}
              title={neutral}
              onPress={onNeutralButtonPress}
            />
          )}
          {negative && (
            <Button
              buttonStyle={styles.button}
              title={negative}
              onPress={onNegativeButtonPress}
            />
          )}
          {positive && (
            <Button
              buttonStyle={styles.button}
              title={positive}
              onPress={onPositiveButtonPress}
            />
          )}
        </View>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginLeft: 24,
    marginRight: 24,
  },
  content: {
    alignSelf: "center",
    marginTop: 24,
    marginLeft: 28,
    marginRight: 28,
  },
  button: { minWidth: 100, margin: 4, marginTop: 24 },
  buttonContainer: { flexDirection: "row", justifyContent: "center" },
  title: {
    justifyContent: "center",
    alignSelf: "center",
    color: defaultStyles.colors.primary,
    fontWeight: "600",
  },
  message: { marginTop: 16 },
});

export default DialogPrompt;
