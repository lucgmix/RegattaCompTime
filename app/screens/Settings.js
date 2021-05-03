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

import { RATING_OVERRIDE, PHRF_FORMULA } from "../config/constants";

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
                boat.defaultRating === "FS"
                  ? useRating(boat.ratingFS, boat.ratingNFS)
                  : useRating(boat.ratingNFS, boat.ratingFS);
              boat.ratingOverride = RATING_OVERRIDE.NONE;
              boat.ratingError = false;
              break;
            case RATING_OVERRIDE.FS:
              boat.rating = useRating(boat.ratingFS, boat.ratingNFS);
              boat.ratingOverride = RATING_OVERRIDE.FS;
              boat.ratingError = boat.rating !== boat.ratingFS;
              break;
            case RATING_OVERRIDE.NFS:
              boat.rating = useRating(boat.ratingNFS, boat.ratingFS);
              boat.ratingOverride = RATING_OVERRIDE.NFS;
              boat.ratingError = boat.rating !== boat.ratingNFS;
              break;
          }
          return boat;
        });

        storeBoatList(ratingOverrideBoatList).then((result) => {
          if (result.ok) {
            // PHRF Rating Override Saved!
          } else {
            // Error prompt here?
            console.warn("An error occured while saving boat list");
          }
        });
      }
    });
  }; //

  const useRating = (preferedRating, otherRating) => {
    if (!isEmpty(preferedRating)) {
      return preferedRating;
    } else {
      return otherRating;
    }
  };

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
