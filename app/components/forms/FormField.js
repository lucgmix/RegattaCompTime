import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";
import defaultStyles from "../../config/styles";
import Text from "../Text";

import { Input } from "react-native-elements";

function AppFormField({ label, name, width, ...otherProps }) {
  const {
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
    values,
  } = useFormikContext();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {/* <Input
       style={styles.input}
       onBlur={() => setFieldTouched(name)}
       onChangeText={(text) => setFieldValue(name, text)}
       value={values[name]}
       width={width}
       errorMessage={touched[name] && errors[name]}
      {...otherProps}
     /> */}
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage
        style={styles.errorMessage}
        error={errors[name]}
        visible={touched[name]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // input: {
  //   color: defaultStyles.colors.text,
  //   fontSize: 16,
  //   marginTop: 10,
  // },
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: defaultStyles.colors.text,
  },
  errorMessage: {
    fontSize: 11,
  },
});

export default AppFormField;
