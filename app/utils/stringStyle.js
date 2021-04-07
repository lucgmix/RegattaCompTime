import React from "react";
import Text from "../components/Text";

const applyBoldStyle = (text) => {
  let numberOfItemsAdded = 0;
  const result = text.sentence.split(/\{\d+\}/);
  text.boldText.forEach((boldText, i) =>
    result.splice(
      ++numberOfItemsAdded + i,
      0,
      <Text style={{ fontWeight: "bold" }}>{boldText}</Text>
    )
  );
  return <Text>{result}</Text>;
};

export { applyBoldStyle };
