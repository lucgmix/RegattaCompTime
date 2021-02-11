import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = "cache";

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return "success";
  } catch (error) {
    //console.log(error);
    return "error";
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const item = JSON.parse(value);

    if (!item) return null;

    return item;
  } catch (error) {
    //console.log(error);
  }
};

const listStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    return result.map((req) => {
      return req;
    });
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
};

export default {
  store,
  get,
  listStorageData,
  clearAll,
};
