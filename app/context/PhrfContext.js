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
} from "../config/constants";

import { useStorage } from "../context/StorageContext";

const RATING = {
  FS: "FS",
  NFS: "NFS",
};

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

  const { getFormulaAB } = useStorage();

  /**
   * Return the corrected time for the specified PHRF rating and elapsed race time.
   * @param {*} elapsedSeconds Seconds since the start of the race.
   * @param {*} phrfRating Rating of the boat.
   * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
   */
  function getCorrectedTime(elapsedSeconds, phrfRating, isAlternate) {
    return Math.round(
      elapsedSeconds *
        (isAlternate
          ? getFormulaTOT(alternateTOT_A, alternateTOT_B, phrfRating)
          : getFormulaTOT(standardTOT_A, standardTOT_B, phrfRating))
    );
  }

  function getFormulaTOT(a, b, phrfRating) {
    return Number(a) / (Number(b) + Number(phrfRating));
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
    const referenceCorrectedTime = getCorrectedTime(
      elapsedSeconds,
      referencePHRF,
      isAlternate
    );

    return results
      .map((result) => {
        const correctedTime = getCorrectedTime(
          elapsedSeconds,
          result.boat.rating,
          isAlternate
        );
        result.diff = referenceCorrectedTime - correctedTime;
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

  useEffect(() => {
    getFormulaAB().then((result) => {
      if (result && result.ok && result.data) {
        setStandardTOT_A(result.data.standardFormula.a);
        setStandardTOT_B(result.data.standardFormula.b);
        setAlternateTOT_A(result.data.alternateFormula.a);
        setAlternateTOT_B(result.data.alternateFormula.b);
      }
    });
  }, []);

  return (
    <PhrfContext.Provider
      value={{
        getElapsedDiff,
        getCorrectedTime,
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
