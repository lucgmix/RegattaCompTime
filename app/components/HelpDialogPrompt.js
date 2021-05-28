import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Text from "./Text";
import Button from "./Button";
import { Dialog } from "react-native-paper";
import defaultStyles from "../config/styles";
import Screen from "./Screen";

function HelpDialogPrompt({
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
      <Screen>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <Dialog.ScrollArea contentContainerStyle={{ marginLeft: 0 }}>
            <ScrollView contentContainerStyle={styles.scrollviewContainer}>
              {message && <Text style={styles.message}>{message}</Text>}
              {content && <Text style={styles.content}>{content}</Text>}
            </ScrollView>
          </Dialog.ScrollArea>

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
      </Screen>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 12,
    backgroundColor: defaultStyles.colors.transparent,
  },
  scrollviewContainer: {},
  content: {
    alignSelf: "center",
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: defaultStyles.colors.transparent,
  },
  button: { minWidth: 100, margin: 4, marginTop: 24 },
  buttonContainer: { flexDirection: "row", justifyContent: "center" },
  title: {
    marginTop: Platform.OS === "ios" ? 24 : -18,
    justifyContent: "center",
    alignSelf: "center",
    color: defaultStyles.colors.primary,
    fontWeight: "600",
    fontSize: 18,
  },
  message: { marginTop: 16 },
});

export default HelpDialogPrompt;
