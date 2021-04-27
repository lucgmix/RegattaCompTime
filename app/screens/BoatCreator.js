import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import Text from "../components/Text";

import defaultStyles from "../config/styles";
import { Form, FormField, SubmitButton, FormSwitch } from "../components/forms";
import * as Yup from "yup";

import { useStorage } from "../context/StorageContext";
import { isEmpty } from "lodash";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const BOAT_CREATOR_MODE = {
  ADD: "add",
  UPDATE: "update",
};

const FIELD_LABEL = {
  BOAT_NAME: "Boat Name",
  BOAT_TYPE: "Boat Type",
  SAIL_NUMBER: "Sail Number",
  FS: "FS (Flying Spinnaker Handicap Rating)",
  NFS: "NFS (Non Flying Spinnaker Handicap Rating)",
  DEFAULT_RATING: "Default Rating",
};

const DEFAULT_RATING = {
  FS: "FS",
  NFS: "NFS",
};

const validationSchema = Yup.object().shape({
  boatName: Yup.string()
    .typeError("Boat name is required")
    .required()
    .min(1)
    .label(FIELD_LABEL.BOAT_NAME),
  boatType: Yup.string().required().min(1).label(FIELD_LABEL.BOAT_TYPE),
  sailNumber: Yup.string().min(1).label(FIELD_LABEL.SAIL_NUMBER),
  ratingFS: Yup.number()
    .typeError("FS Rating needs to be a number")
    .nullable()
    .notRequired()
    .label(FIELD_LABEL.FS)
    .test({
      name: "ratingFS",
      exclusive: false,
      params: {},
      message: "FS Rating is required when Default Rating is FS",
      test: function (value) {
        const formValues = this.options.from[0].value;
        const ratingFSMissing =
          !formValues.useNFSRating && isEmpty(formValues.ratingFS);
        return !ratingFSMissing;
      },
    }),
  ratingNFS: Yup.number()
    .typeError("FS Rating needs to be a number")
    .nullable()
    .label(FIELD_LABEL.NFS)
    .notRequired()
    .test({
      name: "ratingNFS",
      exclusive: false,
      params: {},
      message: "NFS Rating is required when Default Rating is NFS",
      test: function (value) {
        const formValues = this.options.from[0].value;
        const ratingNFSMissing =
          formValues.useNFSRating && isEmpty(formValues.ratingNFS);
        return !ratingNFSMissing;
      },
    }),

  useNFSRating: Yup.boolean()
    .label("useNFSRating")
    .test({
      name: "useNFSRating",
      exclusive: false,
      params: {},
      message: "Default Rating doesn't match rating field",
      test: function (value) {
        const formValues = this.options.from[0].value;
        const ratingNFSMissing =
          formValues.useNFSRating && isEmpty(formValues.ratingNFS);
        const ratingFSMissing =
          !formValues.useNFSRating && isEmpty(formValues.ratingFS);
        const bothRatingsEmpty =
          isEmpty(formValues.ratingNFS) && isEmpty(formValues.ratingFS);
        return bothRatingsEmpty || !(ratingNFSMissing || ratingFSMissing);
      },
    }),
});

function arrayRemove(arr, value) {
  return arr.filter((boat) => boat.id !== value.id);
}

function BoatCreator({ selectedBoat, onSubmitButtonPress, viewMode }) {
  const { storeBoatList, getBoatList } = useStorage();
  const [viewBoatList, setViewBoatList] = useState([]);
  const [editableBoat, setEditableBoat] = useState(selectedBoat);
  const defaultRatingValue =
    editableBoat && editableBoat.defaultRating === DEFAULT_RATING.NFS; // false = FS, true = NFS
  const [useNFSRating, setUseNFSRating] = useState(defaultRatingValue);
  const [boatTypeValue, setBoatTypeValue] = useState();
  const [boatFSValue, setBoatFSValue] = useState();
  const [boatNFSValue, setBoatNFSValue] = useState();

  const toggleDefaultRatingSwitch = (isNFSRating) => {
    setUseNFSRating(isNFSRating);
  };

  const getDefaultRatingLabel = () => {
    return useNFSRating ? DEFAULT_RATING.NFS : DEFAULT_RATING.FS;
  };

  const handleSubmit = async (boat, { resetForm }) => {
    storeData(boat, resetForm);
  };

  const storeData = async (boat, resetForm) => {
    let updatedArray = viewBoatList || [];
    boat.defaultRating = getDefaultRatingLabel();
    boat.useNFSRating = useNFSRating;

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
    getBoatList().then(({ boatData }) => {
      setViewBoatList(boatData);
    });
  };

  const onBoatTypeChange = (item) => {
    setBoatTypeValue(item.value.boatType);
    setBoatFSValue(item.value.ratingFS);
    setBoatNFSValue(item.value.ratingNFS);
  };

  useEffect(() => {
    populateBoatList();
    return () => {
      setViewBoatList([]);
    };
  }, []);

  const headerTitle = editableBoat ? " Edit Boat" : "Add Boat";
  const actionButtonLabel = editableBoat ? " Update" : "Save";

  const boatTypeItems = [
    {
      id: "1",
      boatType: "Laser 28",
      ratingFS: "126",
      ratingNFS: "141",
    },
    {
      id: "2",
      boatType: "C&C 115",
      ratingFS: "63",
      ratingNFS: "93",
    },
    {
      id: "3",
      boatType: "Laser 28",
      ratingFS: "126",
      ratingNFS: "141",
    },
    {
      id: "4",
      boatType: "C&C 115",
      ratingFS: "63",
      ratingNFS: "93",
    },
  ];

  const dropDownItems = boatTypeItems.map((item) => {
    return { label: item.boatType, value: item };
  });

  return (
    <Screen style={styles.container}>
      <SectionHeader title={headerTitle} helpVisible={false} />
      <Form
        initialValues={{
          id: (editableBoat && editableBoat.id) || "",
          boatName: (editableBoat && editableBoat.boatName) || "",
          boatType: (editableBoat && editableBoat.boatType) || "",
          sailNumber: (editableBoat && editableBoat.sailNumber) || "",
          ratingFS: (editableBoat && editableBoat.ratingFS) || null,
          ratingNFS: (editableBoat && editableBoat.ratingNFS) || null,
          useNFSRating: (editableBoat && editableBoat.useNFSRating) || false,
          defaultRating:
            (editableBoat && editableBoat.defaultRating) || DEFAULT_RATING.FS,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <FormField
          maxLength={255}
          label={FIELD_LABEL.BOAT_NAME}
          name="boatName"
        />
        <FormField
          maxLength={255}
          label={FIELD_LABEL.SAIL_NUMBER}
          name="sailNumber"
          placeholder="Optional"
        />
        {!editableBoat && (
          <DropDownPicker
            items={dropDownItems}
            placeholder="Select a Boat Type (Optional)"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: defaultStyles.colors.light }}
            onChangeItem={onBoatTypeChange}
            searchable={true}
            searchablePlaceholder="Search for an item"
            searchablePlaceholderTextColor={defaultStyles.colors.subText}
            seachableStyle={{}}
            searchableError={() => <Text>Not Found</Text>}
            labelStyle={{
              color: defaultStyles.colors.text,
            }}
            activeLabelStyle={{
              color: defaultStyles.colors.medium,
              fontWeight: "700",
            }}
            dropDownMaxHeight={270}
          />
        )}
        <FormField
          maxLength={255}
          label={FIELD_LABEL.BOAT_TYPE}
          name="boatType"
          value={boatTypeValue}
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          label={FIELD_LABEL.FS}
          name="ratingFS"
          value={boatFSValue}
        />
        <FormField
          keyboardType="numeric"
          maxLength={3}
          label={FIELD_LABEL.NFS}
          name="ratingNFS"
          value={boatNFSValue}
        />
        <FormSwitch
          name="useNFSRating"
          label={FIELD_LABEL.DEFAULT_RATING}
          valueFalseLabel={DEFAULT_RATING.FS}
          valueTrueLabel={DEFAULT_RATING.NFS}
          onToggleSwitch={(isNFSRating) =>
            toggleDefaultRatingSwitch(isNFSRating)
          }
        />
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
    paddingBottom: 16,
    backgroundColor: defaultStyles.colors.white,
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
  submitButton: {
    minWidth: 100,
  },
  dropdown: {
    backgroundColor: defaultStyles.colors.light,
    borderWidth: 0,
    color: "red",
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 8,
  },
});

export default BoatCreator;
