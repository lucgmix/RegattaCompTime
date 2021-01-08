import React, { useContext, useState } from "react";
import PHRFUtils, { getBoats } from "../utils/phrf";

const PhrfContext = React.createContext();

export function PhrfProvider({ children }) {
  //const prhrfUtils
  //console.log("Luc", PHRFUtils[getBoats]);

  return (
    <PhrfContext.Provider value={getBoats()}>{children}</PhrfContext.Provider>
  );
}

// export function usePHRFUtils() {
//   return useContext(PhrfContext);
// }

export default PhrfContext;
