import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
//import { getBoatList } from "../api/FirebaseApi";
import storage from "../utils/storage";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [dataChanged, setDataChanged] = useState(false);

  const fetchStoredBoatList = async () => {
    const storedBoatListResult = await storage.get("@boat_list");
    if (storedBoatListResult.ok) {
      return { ok: true, data: storedBoatListResult.data };
    } else {
      console.warn(response.error);
      return { ok: true, error: response.error };
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
          setDataChanged(!dataChanged);
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
    <DataContext.Provider value={{ storeBoatList, getBoatList, dataChanged }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export default DataContext;
