import React, { createContext, useContext, useState, useEffect } from "react";
//import { getBoatList } from "../api/FirebaseApi";
import storage from "../utils/storage";

const RATING = {
  FS: "FS",
  NFS: "NFS",
};

const DataContext = createContext();

export function DataProvider({ children }) {
  const [boatList, setBoatList] = useState([]);

  const fetchStoredBoatList = async () => {
    const storedBoatList = await storage.get("@boat_list");
    setBoatList(storedBoatList);
  };

  const storeBoatList = (value) => {
    return storage.store("@boat_list", value).then((response) => {
      if (value && response === "success") {
        setBoatList(value);
      }
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

// function populateRating(boatArray) {
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

export function useData() {
  return useContext(DataContext);
}

export default DataContext;
