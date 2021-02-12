import React, { createContext, useContext, useState, useEffect } from "react";
//import { getBoatList } from "../api/FirebaseApi";
import storage from "../utils/storage";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [boatList, setBoatList] = useState([]);

  const fetchStoredBoatList = async () => {
    const storedBoatListResult = await storage.get("@boat_list");
    if (storedBoatListResult.ok) {
      setBoatList(storedBoatListResult.data);
    } else {
      console.warn(response.error);
    }
  };

  const storeBoatList = (value) => {
    return storage
      .store("@boat_list", value)
      .then((response) => {
        if (value && response.ok) {
          setBoatList(value);
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  useEffect(() => {
    fetchStoredBoatList();
  }, []);

  return (
    <DataContext.Provider value={{ boatList, storeBoatList }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export default DataContext;
