import React, { createContext, useEffect, useContext, useState } from "react";
import {
  secondsToHms,
  millisecondsToDuration,
  formatDate,
} from "../utils/phrf";

import {
  PHRF_FORMULA_STANDARD_A,
  PHRF_FORMULA_STANDARD_B,
  PHRF_FORMULA_ALTERNATE_A,
  PHRF_FORMULA_ALTERNATE_B,
  RATING_OVERRIDE,
} from "../config/constants";

import { useStorage } from "../context/StorageContext";
import * as MailComposer from "expo-mail-composer";

const PhrfContext = createContext();

export function PhrfProvider({ children }) {
  const [isAlternatePHRF, setIsAlternatePHRF] = useState(false);
  const [ratingOverride, setRatingOverride] = useState("");
  const [standardTOT_A, setStandardTOT_A] = useState(PHRF_FORMULA_STANDARD_A);
  const [standardTOT_B, setStandardTOT_B] = useState(PHRF_FORMULA_STANDARD_B);
  const [alternateTOT_A, setAlternateTOT_A] = useState(
    PHRF_FORMULA_ALTERNATE_A
  );
  const [alternateTOT_B, setAlternateTOT_B] = useState(
    PHRF_FORMULA_ALTERNATE_B
  );

  const [deviceCanEmail, setDeviceCanEmail] = useState(false);

  const { getFormulaAB, getPHRFIsAlternateFormula, getRatingOverride } =
    useStorage();

  /**
   * Return the corrected time for the specified PHRF rating and elapsed race time.
   * @param {*} elapsedSeconds Seconds since the start of the race.
   * @param {*} phrfRating Rating of the boat.
   * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
   */
  function getCorrectedTime(elapsedSeconds, phrfRating, isAlternate) {
    return elapsedSeconds * getFormulaTOT(phrfRating, isAlternate);
  }

  function getFormulaTOT(phrfRating, isAlternate) {
    const standardFormula =
      Number(standardTOT_A) / (Number(standardTOT_B) + Number(phrfRating));
    const alternateFormula =
      Number(alternateTOT_A) / (Number(alternateTOT_B) + Number(phrfRating));
    return isAlternate ? alternateFormula : standardFormula;
  }

  /**
   * TimeDelta relative TOT factor calculation;
   * Calculated by dividing the TOT factor (TF) = 566.431 / (401.431 + PHRF) for each boat,
   * by the TOT factor for the reference boat.
   * @param {*} referenceBoatPhrfRating
   * @param {*} otherBoatPhrfRating
   * @param {*} isAlternate
   */
  function getTimeDeltaTOT(
    referenceBoatPhrfRating,
    otherBoatPhrfRating,
    isAlternate
  ) {
    const refTOT = getFormulaTOT(referenceBoatPhrfRating, isAlternate);
    const otherBoatTOT = getFormulaTOT(otherBoatPhrfRating, isAlternate);
    return otherBoatTOT / refTOT;
  }

  function getTimeDeltaCorrectedTime(
    elapsedSeconds,
    referenceBoatPhrfRating,
    otherBoatPhrfRating,
    isAlternate
  ) {
    return (
      elapsedSeconds /
      getTimeDeltaTOT(referenceBoatPhrfRating, otherBoatPhrfRating, isAlternate)
    );
  }

  /**
   * Returns a sorted array of results by comparing the referencePHRF
   * to other boat ratings based on the race duration
   * @param {*} referencePHRF The phrf rating to compare othe rboats against.
   * @param {*} elapsedSeconds The seconds elpased since the start of the race.
   * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
   */
  function getElapsedDiff(
    boatList,
    referencePHRF,
    elapsedSeconds,
    isAlternate
  ) {
    const results = getResults(boatList, elapsedSeconds, isAlternate);
    const referenceCorrectedTime = getTimeDeltaCorrectedTime(
      elapsedSeconds,
      referencePHRF,
      referencePHRF,
      isAlternate
    );

    return results
      .map((result) => {
        const correctedTime = getTimeDeltaCorrectedTime(
          elapsedSeconds,
          referencePHRF,
          result.boat.rating,
          isAlternate
        );
        result.diff = correctedTime - referenceCorrectedTime;
        return result;
      })
      .sort((a, b) => (a.diff > b.diff ? 1 : -1));
  }

  /**
   * Returns a sorted array of results based on the PHRF rating of boats and race duration.
   * @param {*} boats Array of boats to compute the corrected time.
   * @param {*} elaspedSeconds Seconds since the start of the race.
   * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
   */
  function getResults(boats, elaspedSeconds, isAlternate) {
    return boats
      .map((boat) => {
        const correctedTime = getCorrectedTime(
          elaspedSeconds,
          boat.rating,
          isAlternate
        );
        return { correctedTime, boat };
      })
      .sort((a, b) => (a.correctedTime > b.correctedTime ? 1 : -1));
  }

  const getSettings = () => {
    let ratingOverrideLabel = "PHRF Rating Override: ";
    switch (ratingOverride) {
      case RATING_OVERRIDE.NONE:
        ratingOverrideLabel += "Default";
        break;
      case RATING_OVERRIDE.FS:
        ratingOverrideLabel += "FS (Flying Spinnaker)";
        break;
      case RATING_OVERRIDE.NFS:
        ratingOverrideLabel += "NFS (Non Flying Spinnaker)";
        break;
    }
    return {
      PHRF_Formula: `PHRF Formula: ${
        isAlternatePHRF ? "Alternate" : "Primary"
      }`,
      PHRF_Rating_Override: ratingOverrideLabel,
    };
  };

  const sendEmail = (subject, body) => {
    const bodyWithSettings =
      `--------------------------------------------------\nSettings:\n${
        getSettings().PHRF_Rating_Override
      }\n${
        getSettings().PHRF_Formula
      }\n--------------------------------------------------\n\n` + body;
    MailComposer.composeAsync({
      subject: subject,
      body: bodyWithSettings,
    }).then((result) => {
      // result
      // MailComposerStatus.CANCELLED
      // MailComposerStatus.SAVED
      // MailComposerStatus.SENT
      // MailComposerStatus.UNDETERMINED
    });
  };

  useEffect(() => {
    getRatingOverride().then((result) => {
      if (result.ok) {
        setRatingOverride(result.data);
      }
    });

    getPHRFIsAlternateFormula().then((result) => {
      if (result.ok) {
        setIsAlternatePHRF(result.data);
      }
    });

    getFormulaAB().then((result) => {
      if (result && result.ok && result.data) {
        setStandardTOT_A(result.data.standardFormula.a);
        setStandardTOT_B(result.data.standardFormula.b);
        setAlternateTOT_A(result.data.alternateFormula.a);
        setAlternateTOT_B(result.data.alternateFormula.b);
      }
    });

    MailComposer.isAvailableAsync().then((value) => {
      setDeviceCanEmail(value);
    });
  }, []);

  return (
    <PhrfContext.Provider
      value={{
        getElapsedDiff,
        getCorrectedTime,
        getTimeDeltaCorrectedTime,
        getFormulaTOT,
        standardTOT_A,
        standardTOT_B,
        alternateTOT_A,
        alternateTOT_B,
        setStandardTOT_A,
        setStandardTOT_B,
        setAlternateTOT_A,
        setAlternateTOT_B,
        secondsToHms,
        formatDate,
        isAlternatePHRF,
        setIsAlternatePHRF,
        ratingOverride,
        setRatingOverride,
        millisecondsToDuration,
        deviceCanEmail,
        sendEmail,
      }}
    >
      {children}
    </PhrfContext.Provider>
  );
}

export function usePHRF() {
  return useContext(PhrfContext);
}

export default PhrfContext;
