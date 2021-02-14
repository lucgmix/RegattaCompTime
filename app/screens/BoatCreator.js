import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, Switch } from "react-native";
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
import Text from "../components/Text";
import { useData } from "../context/DataContext";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import defaultStyles from "../config/styles";

export const BOAT_CREATOR_MODE = {
  ADD: "add",
  UPDATE: "update",
};

const FIELD_LABEL = {
  BOAT_NAME: "Boat Name",
  BOAT_TYPE: "Boat Type",
  SAIL_NUMBER: "Sail Number",
  FS: "Flying Spinnaker Handicap Rating",
  NFS: "Non Flying Spinnaker Handicap Rating",
};

const DEFAULT_RATING = {
  FS: "FS",
  NFS: "NSF",
};

const validationSchema = Yup.object().shape({
  boatName: Yup.string()
    .typeError("Boat name is required")
    .required()
    .min(1)
    .label(FIELD_LABEL.BOAT_NAME),
  //   boatType: Yup.string().min(1).label("Boat Type"),
  sailNumber: Yup.string().min(1).label(FIELD_LABEL.SAIL_NUMBER),
  ratingFS: Yup.number()
    .typeError("Non Flying Spinnaker Rating is required")
    .notRequired()
    .label(FIELD_LABEL.FS),
  ratingNFS: Yup.number()
    .notRequired()
    .label(FIELD_LABEL.NFS)
    .when("ratingFS", {
      is: (val) => val === NaN,
      then: Yup.number()
        .required("FS or NFS Handicap Rating required")
        .typeError("Flying Spinnaker Rating is required"),
      otherwise: Yup.number().notRequired(),
    }),
});

function arrayRemove(arr, value) {
  return arr.filter((boat) => boat.id != value.id);
}

function BoatCreator({ selectedBoat, onSubmitButtonPress, viewMode }) {
  const { storeBoatList, getBoatList } = useData();
  const [viewBoatList, setViewBoatList] = useState([]);
  const [editableBoat, setEditableBoat] = useState(selectedBoat);
  const ratingSelectChoice =
    (editableBoat && editableBoat.defaultRating) || DEFAULT_RATING.FS;
  const [defaultRating, setDefaultRating] = useState(ratingSelectChoice);

  const toggleDefaultRatingSwitch = () => {
    if (defaultRating === DEFAULT_RATING.FS) {
      setDefaultRating(DEFAULT_RATING.NFS);
    } else if (defaultRating === DEFAULT_RATING.NFS) {
      setDefaultRating(DEFAULT_RATING.FS);
    }
  };

  const handleSubmit = async (boat, { resetForm }) => {
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

    storeData(boat, resetForm);
  };

  const storeData = async (boat, resetForm) => {
    let updatedArray = viewBoatList || [];
    boat.defaultRating = defaultRating;

    if (viewMode === BOAT_CREATOR_MODE.ADD) {
      boat.id = uuidv4();
    } else {
      //If in edit mode, remove item and re-add the updated one.
      updatedArray = arrayRemove(viewBoatList, editableBoat);
      setEditableBoat(boat);
    }

    updatedArray.push(boat);
    storeBoatList(populateRating(updatedArray)).then((result) => {
      if (result.ok) {
        resetForm();
        onSubmitButtonPress(boat);
      } else {
        console.warn(result.error);
      }
    });
  };

  function populateRating(boatArray) {
    if (Array.isArray(boatArray)) {
      return boatArray.map((item) => {
        if (item.defaultRating === DEFAULT_RATING.FS) {
          item.rating = Number(item.ratingFS);
        } else {
          item.rating = Number(item.ratingNFS);
        }
        return item;
      });
    }
  }

  const populateBoatList = () => {
    getBoatList().then(({ data }) => {
      setViewBoatList(data);
    });
  };

  useEffect(() => {
    populateBoatList();
  }, []);

  const headerTitle = editableBoat ? " Update Boat" : "Add Boat";
  const actionButtonLabel = editableBoat ? " Update" : "Save";

  return (
    <Screen style={styles.container}>
      <SectionHeader title={headerTitle} />
      {/* <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      /> */}

      <Form
        initialValues={{
          id: (editableBoat && editableBoat.id) || "",
          boatName: (editableBoat && editableBoat.boatName) || "",
          boatType: (editableBoat && editableBoat.boatType) || "",
          sailNumber: (editableBoat && editableBoat.sailNumber) || "",
          ratingFS: (editableBoat && editableBoat.ratingFS) || "",
          ratingNFS: (editableBoat && editableBoat.ratingNFS) || "",
          defaultRating: editableBoat && editableBoat.defaultRating,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {/* <FormImagePicker name="images" /> */}
        <FormField
          maxLength={255}
          label="Boat Name"
          name="boatName"
          placeholder={FIELD_LABEL.BOAT_NAME}
        />
        <FormField
          maxLength={255}
          label="Boat Type"
          name="boatType"
          placeholder={FIELD_LABEL.BOAT_TYPE}
        />
        <FormField
          maxLength={255}
          label="Sail Number"
          name="sailNumber"
          placeholder={FIELD_LABEL.SAIL_NUMBER}
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          label="Handicap Rating FS"
          name="ratingFS"
          placeholder={FIELD_LABEL.FS}
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          label="Handicap Rating NFS"
          name="ratingNFS"
          placeholder={FIELD_LABEL.NFS}
        />
        <View style={styles.defaultRating}>
          <Text style={styles.defaultRatingLabel}>Default Rating</Text>
          <View style={styles.defaultRatingSwicthText}>
            <Switch
              name="defaultRating"
              trackColor={{
                false: defaultStyles.colors.secondary,
                true: defaultStyles.colors.primary500,
              }}
              thumbColor={defaultStyles.colors.primary}
              ios_backgroundColor={defaultStyles.colors.mediumlight}
              onValueChange={toggleDefaultRatingSwitch}
              value={defaultRating === DEFAULT_RATING.NFS}
            />
            <Text style={styles.defaultRatingValue}>{defaultRating}</Text>
          </View>
        </View>
        {/* <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        /> */}
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.cancelButton}
            title="Cancel"
            onPress={onSubmitButtonPress}
          />
          <SubmitButton style={styles.submitButton} title={actionButtonLabel} />
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
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 8,
  },
  defaultRating: {
    marginTop: 8,
  },
  defaultRatingLabel: {
    marginBottom: 4,
    fontSize: 13,
  },
  defaultRatingSwicthText: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultRatingValue: {
    marginLeft: 12,
  },
  submitButton: {
    minWidth: 100,
  },
});

export default BoatCreator;
