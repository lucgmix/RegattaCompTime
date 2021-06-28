import { words } from "lodash";

export const capitalizeTheFirstLetterOfEachWord = (words) => {
  let separateWord = words.split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] = excludeChars(separateWord[i]);
    if (!keepCapitalWords(separateWord[i])) {
      separateWord[i] = separateWord[i].toLowerCase();
    }
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
};

const excludeChars = (word) => {
  let cleanedWord = "";
  const excludedWords = ["*"];
  for (let i = 0; i < excludedWords.length; i++) {
    cleanedWord = word.replaceAll(excludedWords[i], "");
  }
  return cleanedWord;
};

const keepCapitalWords = (word) => {
  const keepCapWords = [
    "BS",
    "C&C",
    "CB",
    "CC",
    "CF",
    "CS",
    "CAL",
    "DB",
    "DB1",
    "DK",
    "DS",
    "G&S",
    "GT",
    "HO",
    "IMX",
    "IOR",
    "KDY",
    "S&S",
    "SD",
    "US",
    "VX",
    "OB",
    "-SB",
    "IB",
    "TM",
    "KCB",
    "SK",
    "DP",
    "SD/WK",
    "WK/DK",
    "FR",
    "WK",
    "(TK)",
    "WKI",
    "SM",
    "CF",
    "FK",
    "SQ",
    "J/V",
    "LB",
    "FXK",
    "MH",
    "(XL)",
    "SJ",
    "CIT",
    "LI",
    "RFB",
    "(OB)",
    "(C&C)",
    "SHK",
  ];
  return keepCapWords.includes(word);
};
