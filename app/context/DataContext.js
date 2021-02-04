import React, { createContext, useContext, useState, useMemo } from "react";
import { getBoatList } from "../api/FirebaseApi";

const DataContext = createContext();

export function DataProvider({ children }) {
  return (
    <DataContext.Provider value={{ getBoatList }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export default DataContext;
