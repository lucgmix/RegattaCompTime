import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = "cache";

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const item = JSON.parse(value);

    if (!item) return null;

    return { ok: true, data: item };
  } catch (error) {
    return { ok: false, error };
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
    return { ok: true };
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
