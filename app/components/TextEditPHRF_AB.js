import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Text from "./Text";
import Button from "./Button";
import DialogPrompt from "../components/DialogPrompt";

import defaultStyles from "../config/styles";
import { isEmpty } from "lodash";

function TextEditPHRF_AB({
  formulaA,
  formulaB,
  onApplyAB,
  otherStyles,
  ...otherProps
}) {
  const [valueA, setValueA] = useState(formulaA);
  const [valueB, setValueB] = useState(formulaB);
  const [editable, setEditable] = useState(false);
  const [errorPromptVisible, setErrorPromptVisible] = useState(false);

  const onEditButtonPress = () => {
    setEditable(true);
  };

  const onApplyButtonPress = () => {
    if (
      isEmpty(valueA) ||
      isEmpty(valueB) ||
      isNaN(valueA) ||
      isNaN(valueB) ||
      valueA <= 0 ||
      valueB <= 0
    ) {
      setErrorPromptVisible(true);
    } else {
      setEditable(false);
      onApplyAB(valueA, valueB);
    }
  };

  useEffect(() => {
    setValueA(formulaA);
    setValueB(formulaB);
  }, [formulaA, formulaB]);

  return (
    <View style={[styles.mainContainer, otherStyles]}>
      <DialogPrompt
        title="PHRF A/B Error"
        message={`Oops!\n\nThe value for A and B must be a number greater than zero.`}
        positive="Got it"
        isVisible={errorPromptVisible}
        onPositiveButtonPress={() => setErrorPromptVisible(false)}
      />
      <Text style={styles.description}>
        The PHRF values of A and B in the PHRF formula might have changed.
        Validate these values with your club handicaper.
      </Text>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.inputContainer}>
            <Text>A</Text>
            <TextInput
              placeholder="A"
              placeholderTextColor={defaultStyles.colors.gray}
              style={styles.textInput(editable)}
              keyboardType={"numeric"}
              maxLength={3}
              editable={editable}
              {...otherProps}
              onChangeText={(text) => setValueA(text)}
              value={valueA}
              contextMenuHidden={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>B</Text>
            <TextInput
              placeholder="B"
              placeholderTextColor={defaultStyles.colors.gray}
              style={styles.textInput(editable)}
              keyboardType={"numeric"}
              maxLength={3}
              editable={editable}
              {...otherProps}
              onChangeText={(text) => setValueB(text)}
              value={valueB}
              contextMenuHidden={true}
            />
          </View>
        </View>
        {!editable ? (
          <Button
            buttonStyle={styles.button}
            title="Edit"
            onPress={onEditButtonPress}
          />
        ) : (
          <Button
            buttonStyle={styles.button}
            title="Apply"
            onPress={onApplyButtonPress}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: defaultStyles.colors.mediumlight,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: defaultStyles.colors.darkgray,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: defaultStyles.colors.darkgray,
    padding: 4,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: defaultStyles.colors.light,
  },
  button: {
    minWidth: 70,
  },
  description: {
    fontSize: 12,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginLeft: 8,
  },
  textInput(editable) {
    return {
      width: 48,
      marginLeft: 4,
      padding: 6,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: editable
        ? defaultStyles.colors.primary
        : defaultStyles.colors.gray,
      color: editable
        ? defaultStyles.colors.text
        : defaultStyles.colors.disabledText,
    };
  },
  label: {},
});

export default TextEditPHRF_AB;
