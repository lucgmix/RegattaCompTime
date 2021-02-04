import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";
import defaultStyles from "../../config/styles";

import { Input } from "react-native-elements";

function AppFormField({ name, width, ...otherProps }) {
  const {
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
    values,
  } = useFormikContext();

  console.log(touched[name]);

  return (
    // <Input
    //   style={styles.input}
    //   onBlur={() => setFieldTouched(name)}
    //   onChangeText={(text) => setFieldValue(name, text)}
    //   value={values[name]}
    //   width={width}
    //   errorMessage={touched[name] && errors[name]}
    //   {...otherProps}
    // />
    <>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    color: defaultStyles.colors.text,
    fontSize: 16,
  },
});

export default AppFormField;
