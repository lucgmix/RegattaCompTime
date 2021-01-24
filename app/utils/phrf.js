// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring/538-nsc-time-on-time-explained
// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring

import moment from "moment";

//export default function phrfUtils() {
/**
 * Returns the standard (evening racing) Time on Time factor based on the PHRF rating.
 * @param {*} phrf Rating of the boat.
 */
function getTOT(phrf) {
  return 566.431 / (401.431 + phrf);
}

/**
 * Returns the alternate (evening racing) Time on Time factor based on the PHRF rating.
 * @param {*} phrf Rating of the boat.
 */
function getAlternateTOT(phrf) {
  return 650 / (550 + phrf);
}

/**
 * Return the corrected time for the specified PHRF rating and elapsed race time.
 * @param {*} elapsedSeconds Seconds since the start of the race.
 * @param {*} phrfRating Rating of the boat.
 * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
 */
function getCorrectedTime(elapsedSeconds, phrfRating, isAlternate) {
  return Math.round(
    elapsedSeconds *
      (isAlternate ? getAlternateTOT(phrfRating) : getTOT(phrfRating))
  );
}

/**
 * Returns a sorted array of results based on the PHRF rating of boats and race duration.
 * @param {*} boats Array of boats to compute the corrected time.
 * @param {*} elaspedSeconds Seconds since the start of the race.
 * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
 */
function getResults(boats, elaspedSeconds, isAlternate) {
  return boats
    .map((boat) => {
      const correctedTime = getCorrectedTime(
        elaspedSeconds,
        boat.rating,
        isAlternate
      );
      return { correctedTime, boat };
    })
    .sort((a, b) => (a.correctedTime > b.correctedTime ? 1 : -1));
}

/**
 * Returns a sorted array of results by comparing the referencePHRF
 * to other boat ratings based on the race duration
 * @param {*} referencePHRF The phrf rating to compare othe rboats against.
 * @param {*} elapsedSeconds The seconds elpased since the start of the race.
 * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
 */
export function getElapsedDiff(
  boatList,
  referencePHRF = 126,
  elapsedSeconds = 3600,
  isAlternate
) {
  const results = getResults(boatList, elapsedSeconds, isAlternate);
  const referenceCorrectedTime = getCorrectedTime(
    elapsedSeconds,
    referencePHRF,
    isAlternate
  );
  return results
    .map((result) => {
      const correctedTime = getCorrectedTime(
        elapsedSeconds,
        result.boat.rating,
        isAlternate
      );
      result.diff = referenceCorrectedTime - correctedTime;
      return result;
    })
    .sort((a, b) => (a.diff > b.diff ? 1 : -1));
}

export function secondsToHms(seconds, allowZero = true) {
  const isNegative = seconds < 0;
  const duration = moment.duration(Math.abs(seconds * 1000));

  const hour = duration.get("hours");
  const minute = duration.get("minutes");
  const second = duration.get("seconds");

  const hourString = hour !== 0 ? `${hour}h ` : "";

  const minuteString = minute !== 0 ? `${minute}m ` : "";
  const secondString = second !== 0 || allowZero ? `${second}s` : "";

  const negativePrefix = isNegative ? "-" : "";
  const durationString = `${negativePrefix}${hourString}${minuteString}${secondString}`;

  return durationString;
}

function printResults(isAlternate = false) {
  getElapsedDiff(boats, 126, 3600, isAlternate).forEach((result) => {
    const timeStamp = secondsToHms(result.diff);
    console.log(`${result.boat.rating} ${result.boat.name} ${timeStamp}`);
  });
}

export function getBoats() {
  return [
    {
      name: "Busted Flush",
      type: "B 32",
      sail: "46232",
      rating: 73,
    },
    {
      name: "Gunsmoke",
      type: "Beneteau 1st Class 10",
      sail: "84110",
      rating: 100,
    },
    {
      name: "Oshunmare",
      type: "Viper 640",
      sail: "288",
      rating: 106,
    },
    {
      name: "Wadjet",
      type: "Viper 640",
      sail: "211",
      rating: 106,
    },

    {
      name: "Colibri",
      type: "Laser 28",
      sail: "224",
      rating: 126,
    },
    {
      name: "Shady Lady",
      type: "CS 33",
      sail: "3330",
      rating: 149,
    },
    {
      name: "Organized Chaos",
      type: "J80",
      sail: "669",
      rating: 126,
    },
    {
      name: "HiJinx",
      type: "J-30",
      sail: "106",
      rating: 128,
    },
    {
      name: "Wind Warrior",
      type: "C&C 115",
      sail: "11585",
      rating: 63,
    },
    {
      name: "Gone",
      type: "J/70",
      sail: "550",
      rating: 117,
    },
  ];
}
