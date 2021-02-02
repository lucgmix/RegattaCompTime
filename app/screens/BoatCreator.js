import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import storage from "../utils/storage";
import { getBoats } from "../utils/phrf";

function BoatCreator(props) {
  const getStorageContent = async () => {
    const boats = getBoats();
    const storedValue = await storage.get("@boat_list");
    //console.log("getStorageContent", storedValue);
  };

  const storeData = async () => {
    //await storage.clearAll();
    const boats = getBoats();
    const storedValue = await storage.store("@boat_list", boats);
    //console.log("storeData", storedValue);
  };

  const getAllStorage = async () => {
    const storedValue = await storage.listStorageData();
    console.log("getAllStorage", storedValue);
  };

  useEffect(() => {
    // storeData();
    // getStorageContent();
    getAllStorage();

    //getStorageContent();
    //storage.listStorageData().then((value) => console.log(value));
  }, []);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {},
});

export default BoatCreator;
