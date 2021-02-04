import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import * as Yup from "yup";

import storage from "../utils/storage";
import { getBoats } from "../utils/phrf";

const validationSchema = Yup.object().shape({
  boatName: Yup.string().required().min(1).label("Boat Name"),
  boatType: Yup.string().min(1).label("Boat Type"),
  sailNumber: Yup.string().min(1).label("Sail Number"),
  ratingFS: Yup.number().required().min(1).label("Rating Flying Spinnaker"),
  ratingNFS: Yup.number()
    .required()
    .min(1)
    .label("Rating Non Flying Spinnaker"),
});

function BoatCreator({ selectedBoat, isModalVisible, onModalButtonPress }) {
  const getStorageContent = async () => {
    const boats = getBoats();
    const storedValue = await storage.get("@boat_list");
    //console.log("getStorageContent", storedValue);
  };

  const storeData = async () => {
    //await storage.clearAll();
    const boats = getBoats();
    const storedValue = await storage.store("@boat_list", boats);
    //console.log("storeData", storedValue);
  };

  const getAllStorage = async () => {
    const storedValue = await storage.listStorageData();
    //console.log("getAllStorage", storedValue);
  };

  useEffect(() => {
    // storeData();
    // getStorageContent();
    getAllStorage();

    //getStorageContent();
    //storage.listStorageData().then((value) => console.log(value));
  }, []);

  const handleSubmit = async (listing, { resetForm }) => {
    // setProgress(0);
    // setUploadVisible(true);
    // const result = await listingsApi.addListing(
    //   { ...listing, location },
    //   (progress) => setProgress(progress)
    // );
    // if (!result.ok) {
    //   setUploadVisible(false);
    //   return alert("Could not save the listing");
    // }
    console.log("handleSubmit");
    resetForm();
  };

  //const { name, type, rating_fs, rating_nfs } = selectedBoat && selectedBoat;
  console.log("SELECTED BOAT", selectedBoat);

  const actionButtonLabel = selectedBoat ? " Update Boat" : "Create Boat";

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Boat Creator" />
      {/* <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      /> */}
      <Form
        initialValues={{
          boatName: selectedBoat && selectedBoat.name,
          boatType: selectedBoat && selectedBoat.type,
          sailNumber: "",
          ratingFS: selectedBoat && selectedBoat.rating_fs,
          ratingNFS: selectedBoat && selectedBoat.rating_nfs,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* <FormImagePicker name="images" /> */}
        <FormField maxLength={255} name="boatName" placeholder="Boat Name" />
        <FormField maxLength={255} name="boatType" placeholder="Boat Type" />
        <FormField
          maxLength={255}
          name="sailNumber"
          placeholder="Sail Number"
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          name="ratingFS"
          placeholder="Rating - Flying Spinnaker"
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          name="ratingNFS"
          placeholder="Rating - Non Flying Spinnaker"
        />
        {/* <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        /> */}
        <View style={styles.buttonContainer}>
          <SubmitButton title={actionButtonLabel} />
          <Button
            buttonStyle={styles.cancelButton}
            title="Cancel"
            onPress={onModalButtonPress}
          />
        </View>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cancelButton: {
    marginLeft: 8,
  },
});

export default BoatCreator;
