import React, { createContext, useContext, useState } from "react";
import { getBoats, getElapsedDiff, secondsToHms } from "../utils/phrf";

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
      }}
    >
      {children}
    </PhrfContext.Provider>
  );
}

export function usePHRF() {
  const {
    getBoats,
    getElapsedDiff,
    secondsToHms,
    isAlternatePHRF,
    setIsAlternatePHRF,
  } = useContext(PhrfContext);

  return {
    getBoats,
    getElapsedDiff,
    secondsToHms,
    isAlternatePHRF,
    setIsAlternatePHRF,
  };
}

export default PhrfContext;
