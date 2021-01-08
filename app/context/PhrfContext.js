import React, { useContext, useState } from "react";
import { getBoats, getElapsedDiff, secondsToHms } from "../utils/phrf";

const PhrfContext = React.createContext();

export function PhrfProvider({ children }) {
  return (
    <PhrfContext.Provider value={{ getBoats, getElapsedDiff, secondsToHms }}>
      {children}
    </PhrfContext.Provider>
  );
}

// export function usePHRFUtils() {
//   return useContext(PhrfContext);
// }

export default PhrfContext;
