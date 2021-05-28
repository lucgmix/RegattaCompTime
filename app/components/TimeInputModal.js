import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import TimeInput from "../components/TimeInput";
import Button from "../components/Button";
import Screen from "../components/Screen";

function TimeInputModal({
  duration,
  isModalVisible,
  onDurationChange,
  onModalButtonPress,
  buttonLabel,
}) {
  return (
    <Modal visible={isModalVisible} animationType="fade">
      <Screen>
        <View style={styles.container}>
          <TimeInput duration={duration} onDurationChange={onDurationChange} />
          <Button
            title={buttonLabel}
            onPress={onModalButtonPress}
            style={{ minWidth: 80 }}
          ></Button>
        </View>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TimeInputModal;
