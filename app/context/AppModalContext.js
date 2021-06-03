import React, { createContext, useState } from "react";
import WelcomeDialogPrompt from "../components/WelcomeDialogPrompt";
import { applyBoldStyle } from "../utils/stringStyle";

let ModalContext;
const { Provider } = (ModalContext = createContext());

const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showAppModal = (value) => {
    setModalVisible(value);
  };

  const getAppHelpString = (tag) => {
    let textToStyle;
    switch (tag) {
      case "message":
        textToStyle = {
          sentence: `The {0} section allows you to track realtime results (Corrected Time and Elapsed race time) for boats in a race.`,
          boldText: ["Race"],
        };
        break;
      case "content":
        textToStyle = {
          sentence:
            "{0} Allows you to enter the race start time for the current day.\n\n{1} Allows you to start the race timer at the current time.\n\n{2} Allows you to modify the start time of a race that was finished.\n\n{3} Stops the race timer and displays ranking sorted results based on corrected time.\n\n{4} Clears the race results and sorts the boats by rating, faster boats appear higher in the list.\n\n{5} Click a boat's Finish button to record their race finish.",
          boldText: [
            "Start Time...",
            "Start Now",
            "Edit Start Time...",
            "Finish Race",
            "Clear Race",
            "Finish",
            "Edit...",
          ],
        };
        break;
    }

    return applyBoldStyle(textToStyle);
  };

  return (
    <Provider value={{ modalVisible, showAppModal }}>
      <WelcomeDialogPrompt
        title="Welcome to Regatte Comp Time"
        // message={getAppHelpString("message")}
        // content={getAppHelpString("content")}
        positive="Got it"
        isVisible={modalVisible}
        onPositiveButtonPress={() => showAppModal(false)}
      />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
