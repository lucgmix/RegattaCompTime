import React, { createContext, useState } from "react";
import WelcomeDialogPrompt from "../components/WelcomeDialogPrompt";
import { useStorage } from "../context/StorageContext";
import { WELCOME_SCREEN_KEY } from "../config/constants";

let ModalContext;
const { Provider } = (ModalContext = createContext());

const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { storeValueForKey } = useStorage();

  const showAppModal = (value) => {
    setModalVisible(value);
  };

  const handleDontShowAgain = (value) => {
    setDontShowAgain(value);
    storeValueForKey(WELCOME_SCREEN_KEY, value);
  };

  return (
    <Provider value={{ modalVisible, showAppModal }}>
      <WelcomeDialogPrompt
        title="Welcome to Regatta Comp Time"
        positive="Got it"
        isVisible={modalVisible}
        onPositiveButtonPress={() => showAppModal(false)}
        onDontShowAgainClick={handleDontShowAgain}
      />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
