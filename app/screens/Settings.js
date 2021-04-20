import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Screen from "../components/Screen";

import { usePHRF } from "../context/PhrfContext";
import { useStorage } from "../context/StorageContext";

import SectionHeader from "../components/SectionHeader";

import PhrfAlternateRadioGroup from "../components/PhrfAlternateRadioGroup";

export const PHRF_FORMULA = {
  STANDARD: "standard",
  ALTERNATE: "alternate",
};

function Settings(props) {
  const {
    isAlternatePHRF,
    setIsAlternatePHRF,
    ratingOverride,
    setRatingOverride,
  } = usePHRF();
  const [value, setValue] = useState(
    isAlternatePHRF ? PHRF_FORMULA.ALTERNATE : PHRF_FORMULA.STANDARD
  );

  const { storePHRFIsAlternateFormula, storeRatingOverride } = useStorage();

  const updatePhrfFormula = (value) => {
    setValue(value);
    const isAlternate = value === PHRF_FORMULA.ALTERNATE;
    setIsAlternatePHRF(isAlternate);
    storePHRFIsAlternateFormula(isAlternate);
  };

  useEffect(() => {
    const override = "";
    setRatingOverride(override);
    storeRatingOverride(override);
    console.log("ratingOverride", override);
  }, [ratingOverride]);

  return (
    <Screen style={styles.container}>
      <SectionHeader title="Settings" helpVisible={false} />
      <PhrfAlternateRadioGroup
        value={value}
        onUpdatePhrfFormula={updatePhrfFormula}
      />
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
});

export default Settings;
