import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";

import Screen from "../components/Screen";
import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";
import { isEmpty } from "lodash";

import SectionHeader from "../components/SectionHeader";
import PhrfAlternateRadioGroup from "../components/PhrfAlternateRadioGroup";
import PhrfRatingOverrideRadioGroup from "../components/PhrfRatingOverrideRadioGroup";

export const PHRF_FORMULA = {
  STANDARD: "standard",
  ALTERNATE: "alternate",
};

export const RATING_OVERRIDE = {
  NONE: "",
  FS: "FS",
  NFS: "NFS",
};

function Settings(props) {
  const {
    isAlternatePHRF,
    setIsAlternatePHRF,
    ratingOverride,
    setRatingOverride,
  } = usePHRF();
  const [alternatePHRFValue, setAlternatePHRFValue] = useState(
    isAlternatePHRF ? PHRF_FORMULA.ALTERNATE : PHRF_FORMULA.STANDARD
  );
  const {
    storeBoatList,
    getBoatList,
    storePHRFIsAlternateFormula,
    storeRatingOverride,
  } = useStorage();

  const updatePhrfFormula = (value) => {
    setAlternatePHRFValue(value);
    const isAlternate = value === PHRF_FORMULA.ALTERNATE;
    setIsAlternatePHRF(isAlternate);
    storePHRFIsAlternateFormula(isAlternate);
  };

  const updateRatingOverride = (value) => {
    setRatingOverride(value);
    storeRatingOverride(value);

    updateBoatRatings(value);
  };

  const updateBoatRatings = (value) => {
    getBoatList().then((boatList) => {
      if (!isEmpty(boatList?.boatData)) {
        const ratingOverrideBoatList = boatList.boatData.map((boat) => {
          switch (value) {
            case RATING_OVERRIDE.NONE:
              boat.rating =
                boat.defaultRating === "FS" ? boat.ratingFS : boat.ratingNFS;
              boat.ratingOverride = RATING_OVERRIDE.NONE;
              break;
            case RATING_OVERRIDE.FS:
              boat.rating = boat.ratingFS;
              boat.ratingOverride = RATING_OVERRIDE.FS;
              break;
            case RATING_OVERRIDE.NFS:
              boat.rating = boat.ratingNFS;
              boat.ratingOverride = RATING_OVERRIDE.NFS;
              break;
          }
          return boat;
        });

        storeBoatList(ratingOverrideBoatList).then((result) => {
          if (result.ok) {
            // PHRF Rating Override Saved!
          } else {
            // Error prompt here?
          }
        });
      }
    });
  }; //

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Settings" helpVisible={false} />
      <ScrollView>
        <PhrfRatingOverrideRadioGroup
          value={ratingOverride}
          onUpdateSelection={updateRatingOverride}
        />
        <Divider style={styles.divider} />
        <PhrfAlternateRadioGroup
          value={alternatePHRFValue}
          onUpdateSelection={updatePhrfFormula}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 16,
  },
  divider: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 12,
    marginBottom: 12,
  },
});

export default Settings;
