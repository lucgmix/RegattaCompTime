import React, { createContext, useContext, useState, useEffect } from "react";
import storage from "../utils/storage";

const RATING_OVERRIDE = {
  NONE: "",
  FS: "FS",
  NFS: "NFS",
};

const StorageContext = createContext();

export function StorageDataContext({ children }) {
  const [boatDataChanged, setBoatDataChanged] = useState(false);
  const [formulaABChanged, setFormulaABChanged] = useState(false);

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
          setBoatDataChanged(!boatDataChanged);
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  const storeFormulaAB = (value) => {
    return storage
      .store("@formulaAB", value)
      .then((response) => {
        if (value && response.ok) {
          setFormulaABChanged(!formulaABChanged);
          return { ok: true };
        }
      })
      .catch((error) => {
        return { ok: false, error };
      });
  };

  const getFormulaAB = () => {
    return getValueForKey("@formulaAB");
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

  const storeRatingOverride = async (value) => {
    return storeValueForKey("@phrf_rating_override", value);
  };

  const getRatingOverride = () => {
    return getValueForKey("@phrf_rating_override");
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
        storeFormulaAB,
        getFormulaAB,
        formulaABChanged,
        storePHRFIsAlternateFormula,
        getPHRFIsAlternateFormula,
        storeRatingOverride,
        getRatingOverride,
        storeValueForKey,
        getValueForKey,
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
