import React, { createContext, useContext, useState } from "react";
import {
  getBoats,
  getElapsedDiff,
  secondsToHms,
  getCorrectedTime,
  millisecondsToDuration,
  formatDate,
} from "../utils/phrf";

const RATING = {
  FS: "FS",
  NFS: "NFS",
};

const PhrfContext = createContext();

export function PhrfProvider({ children }) {
  const [isAlternatePHRF, setIsAlternatePHRF] = useState(false);
  const [ratingOverride, setRatingOverride] = useState("");
  const [standardTOT, setStandardTOT] = useState();
  const [alternateTOT, setAlternateTOT] = useState();
  const [standardTOT_A, setStandardTOT_A] = useState();
  const [standardTOT_B, setStandardTOT_B] = useState();
  const [alternateTOT_A, setAlternateTOT_A] = useState();
  const [alternateTOT_B, setAlternateTOT_B] = useState();

  return (
    <PhrfContext.Provider
      value={{
        getBoats,
        getElapsedDiff,
        getCorrectedTime,
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
