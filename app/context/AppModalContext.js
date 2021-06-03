import React, { createContext, useState } from "react";
import WelcomeDialogPrompt from "../components/WelcomeDialogPrompt";

let ModalContext;
const { Provider } = (ModalContext = createContext());

const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showAppModal = (value) => {
    setModalVisible(value);
  };

  return (
    <Provider value={{ modalVisible, showAppModal }}>
      <WelcomeDialogPrompt
        title="Welcome to Regatte Comp Time"
        positive="Got it"
        isVisible={modalVisible}
        onPositiveButtonPress={() => showAppModal(false)}
      />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
