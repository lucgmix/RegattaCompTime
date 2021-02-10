import React, { createContext, useContext, useState } from "react";
import { getBoats, getElapsedDiff, secondsToHms } from "../utils/phrf";

const RATING = {
  FS: "FS",
  NFS: "NFS",
};

const PhrfContext = createContext();

export function PhrfProvider({ children }) {
  const [isAlternatePHRF, setIsAlternatePHRF] = useState(false);

  return (
    <PhrfContext.Provider
      value={{
        getBoats,
        getElapsedDiff,
        secondsToHms,
        isAlternatePHRF,
        setIsAlternatePHRF,
        // getSelectedRating,
      }}
    >
      {children}
    </PhrfContext.Provider>
  );
}

// function getSelectedRating(boatArray) {
//   if (Array.isArray(boatArray)) {
//     return boatArray.map((item) => {
//       if (item.defaultRating === RATING.FS) {
//         item.rating = item.ratingFS;
//       } else {
//         item.rating = item.ratingNFS;
//       }
//       return item;
//     });
//   }
// }

export function usePHRF() {
  return useContext(PhrfContext);
}

export default PhrfContext;
