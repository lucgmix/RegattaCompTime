import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/Text";

function TabBarButton({ icon, title }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {icon}
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default TabBarButton;
