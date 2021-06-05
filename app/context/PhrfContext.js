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
        // getSelectedRating,
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
