import React, { createContext, useContext, useState, useMemo } from "react";
import { getBoatList } from "../api/FirebaseApi";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={{ getBoatList }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export default FirebaseContext;
