import React, { useContext, useState } from "react";
import { getBoats, getElapsedDiff, secondsToHms } from "../utils/phrf";

const PhrfContext = React.createContext();

export function PhrfProvider({ children }) {
  const [isAlterNatePHRF, setIsAlternatePHRF] = useState(false);

  return (
    <PhrfContext.Provider
      value={{
        getBoats,
        getElapsedDiff,
        secondsToHms,
        isAlterNatePHRF,
        setIsAlternatePHRF,
      }}
    >
      {children}
    </PhrfContext.Provider>
  );
}

// export function usePHRFUtils() {
//   return useContext(PhrfContext);
// }

export default PhrfContext;
