import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = "cache";

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const item = JSON.parse(value);

    if (!item) return null;

    return item;
  } catch (error) {
    console.log(error);
  }
};

const listStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    //console.log("KEYS", keys);

    const result = await AsyncStorage.multiGet(keys);
    console.log("RESULT", result);

    return result.map((req) => {
      //console.log("PARSING", JSON.parse(req));
      return req;
    }); //.forEach(console.log);
    //return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
};

const clearAll = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log("Done.");
};

export default {
  store,
  get,
  listStorageData,
  clearAll,
};
