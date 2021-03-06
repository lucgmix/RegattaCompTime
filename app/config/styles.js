import { Platform } from "react-native";

import colors from "./colors";

export default {
  colors,
  text: {
    color: colors.text,
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    letterSpacing: 0.5,
  },
};
