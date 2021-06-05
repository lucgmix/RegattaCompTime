import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";
import defaultStyles from "../config/styles";
import Button from "./Button";

function ShowWelcomeHelp({ onButtonPress }) {
  return (
    <View style={styles.container}>
      <Text style={([defaultStyles.text], styles.title)}>
        Welcome Screen Help
      </Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          The Welcome shows general information about the application at
          startup. From here, you can display this screen at anytime even if you
          checked 'Don't show again'.
        </Text>
        <Button
          title="Show Welcome Screen"
          onPress={onButtonPress}
          buttonStyle={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
    margin: 4,
  },
  title: {
    marginLeft: 4,
  },
  textContainer: {
    backgroundColor: defaultStyles.colors.mediumlight,
    marginTop: 8,
    marginLeft: 48,
    marginRight: 4,
    padding: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default ShowWelcomeHelp;
