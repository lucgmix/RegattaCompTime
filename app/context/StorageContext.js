import React, { createContext, useContext, useState, useEffect } from "react";
//import { getBoatList } from "../api/FirebaseApi";
import storage from "../utils/storage";

const StorageContext = createContext();

export function StorageDataContext({ children }) {
  const [boatDataChanged, setDataChanged] = useState(false);

  const fetchStoredBoatList = async () => {
    const storedBoatListResult = await storage.get("@boat_list");
    if (storedBoatListResult.ok) {
      return { ok: true, boatData: storedBoatListResult.data };
    } else {
      console.warn(storedBoatListResult.error);
      return { ok: false, error: storedBoatListResult.error };
    }
  };

  const getBoatList = () => {
    return fetchStoredBoatList();
  };

  const storeBoatList = (value) => {
    return storage
      .store("@boat_list", value)
      .then((response) => {
        if (value && response.ok) {
          setDataChanged(!boatDataChanged);
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  const getRaceResults = async () => {
    const storedRaceResult = await storage.get("@race_results");
    if (storedRaceResult && storedRaceResult.ok) {
      return { ok: true, resultsData: storedRaceResult.data };
    } else {
      if (storedRaceResult) {
        console.warn(storedRaceResult.error);
        return { ok: false, error: storedRaceResult.error };
      } else {
        return { ok: false, error: "An unknown error occured" };
      }
    }
  };

  const storeRaceResults = (value) => {
    return storage
      .store("@race_results", value)
      .then((response) => {
        if (value && response.ok) {
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  const storeValueForKey = (key, value) => {
    return storage
      .store(key, value)
      .then((response) => {
        if (value && response.ok) {
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  const getValueForKey = async (key) => {
    const storedValueResult = await storage.get(key);
    if (storedValueResult && storedValueResult.ok) {
      return { ok: true, data: storedValueResult.data };
    } else {
      if (storedValueResult) {
        console.warn(storedValueResult.error);
        return { ok: false, error: storedValueResult.error };
      } else {
        return { ok: false, error: "An unknown error occured" };
      }
    }
  };

  const storePHRFIsAlternateFormula = (value) => {
    return storeValueForKey("@phrf_formula", value);
  };

  const getPHRFIsAlternateFormula = () => {
    return getValueForKey("@phrf_formula");
  };

  useEffect(() => {
    fetchStoredBoatList();
  }, []);

  return (
    <StorageContext.Provider
      value={{
        storeBoatList,
        storeRaceResults,
        getBoatList,
        getRaceResults,
        boatDataChanged,
        storePHRFIsAlternateFormula,
        getPHRFIsAlternateFormula,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
}

export default StorageContext;
