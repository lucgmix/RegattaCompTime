export const capitalizeTheFirstLetterOfEachWord = (words) => {
  let separateWord = words.split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    if (!isExcludedWords(separateWord[i])) {
      separateWord[i] = separateWord[i].toLowerCase();
    }
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
};

const isExcludedWords = (word) => {
  const excludedWords = [
    "C&C",
    "CC",
    "CS",
    "CAL",
    "DB1",
    "DS",
    "G&S",
    "GT",
    "HO",
    "IMX",
    "IOR",
    "KDY",
    "S&S",
    "US",
    "VX",
  ];
  return excludedWords.includes(word);
};
