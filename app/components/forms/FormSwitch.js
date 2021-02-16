import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { StyleSheet, Switch, View } from "react-native";

import ErrorMessage from "./ErrorMessage";
import defaultStyles from "../../config/styles";
import Text from "../Text";

function AppFormSwitch({
  label,
  name,
  valueFalseLabel,
  valueTrueLabel,
  onToggleSwitch,
}) {
  const {
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
    values,
  } = useFormikContext();

  return (
    <View style={styles.container}>
      <Text style={styles.titleLabel}>{label}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.valueFalseLabel}>{valueFalseLabel}</Text>
        <Switch
          onBlur={() => setFieldTouched(name)}
          name={name}
          trackColor={{
            false: defaultStyles.colors.secondary,
            true: defaultStyles.colors.primary500,
          }}
          thumbColor={defaultStyles.colors.primary}
          ios_backgroundColor={defaultStyles.colors.mediumlight}
          onValueChange={(value) => {
            onToggleSwitch(value);
            return setFieldValue(name, value);
          }}
          value={values[name]}
        />
        <Text style={styles.valueTrueLabel}>{valueTrueLabel}</Text>
      </View>
      <ErrorMessage
        style={styles.errorMessage}
        error={errors[name]}
        visible={touched[name]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  titleLabel: {
    marginBottom: 4,
    fontSize: 13,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: defaultStyles.colors.text,
  },
  errorMessage: {
    marginTop: 4,
    fontSize: 11,
  },
  valueFalseLabel: {
    marginRight: 8,
  },
  valueTrueLabel: {
    marginLeft: 8,
  },
});

export default AppFormSwitch;
