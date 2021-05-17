import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import TimeInput from "./TimeInput";
import Button from "./Button";
import Screen from "./Screen";
import Text from "../components/Text";
import SectionHeader from "../components/SectionHeader";

function ElapsedTimeInputModal({
  boatEditResult,
  isModalVisible,
  onElapsedTimeChange,
  onModalButtonPress,
  buttonLabel,
}) {
  return (
    <Modal visible={isModalVisible} animationType="fade">
      <Screen>
        <SectionHeader title="Edit Elapsed Time" helpVisible={false} />

        <View style={styles.container}>
          <View style={styles.boatMetaContainer}>
            <Text style={styles.boatMeta}>
              {boatEditResult && boatEditResult.boat.boatName}
            </Text>
            <Text style={styles.boatMeta}>
              {boatEditResult && boatEditResult.boat.boatType}
            </Text>
            <Text style={styles.timeHeader}>Elapsed Time</Text>
          </View>

          <View style={styles.timeInputContainer}>
            <TimeInput
              duration={
                (boatEditResult &&
                  Math.round(boatEditResult.elapsedTime / 1000)) ||
                0
              }
              onDurationChange={onElapsedTimeChange}
            />
            <Button
              title={buttonLabel}
              onPress={onModalButtonPress}
              style={{ minWidth: 80 }}
            ></Button>
          </View>
        </View>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  boatMeta: {
    fontSize: 22,
  },
  boatMetaContainer: {
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timeHeader: {
    fontSize: 22,
    marginTop: 12,
    fontWeight: "600",
    alignItems: "flex-start",
  },
  timeInputContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ElapsedTimeInputModal;
