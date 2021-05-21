import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import TimeInput from "./TimeInput";
import Button from "./Button";
import Screen from "./Screen";
import Text from "../components/Text";
import SectionHeader from "../components/SectionHeader";
import defaultStyles from "../config/styles";

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
            <Text style={styles.boatMetaTitle}>
              {boatEditResult && boatEditResult.boat.boatName}
            </Text>
            <Text style={styles.boatMetaType}>
              {boatEditResult && boatEditResult.boat.boatType}
            </Text>
            <Text style={styles.boatMetaRating}>
              {`FS: ${boatEditResult && boatEditResult.boat.ratingFS}`}
            </Text>
            <Text style={styles.boatMetaRating}>
              {`NFS: ${boatEditResult && boatEditResult.boat.ratingNFS}`}
            </Text>
          </View>

          <View style={styles.timeInputContainer}>
            <Text style={styles.timeHeader}>Elapsed Time</Text>
            <TimeInput
              duration={
                (boatEditResult &&
                  Math.round(boatEditResult.elapsedTime / 1000)) ||
                0
              }
              onDurationChange={onElapsedTimeChange}
            />
          </View>
          <Button
            title={buttonLabel}
            onPress={onModalButtonPress}
            buttonStyle={{ minWidth: 80, marginTop: 24 }}
          ></Button>
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
  boatMetaTitle: {
    fontSize: 28,
  },
  boatMetaType: {
    fontSize: 18,
  },
  boatMetaRating: {
    fontSize: 16,
  },
  boatMetaContainer: {
    marginTop: 14,
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
    backgroundColor: defaultStyles.colors.primary300,
    borderRadius: 8,
    padding: 12,
    paddingBottom: 24,
    marginTop: 12,
  },
});

export default ElapsedTimeInputModal;
