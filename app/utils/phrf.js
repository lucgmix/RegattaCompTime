// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring/538-nsc-time-on-time-explained
// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring
import { format } from "date-fns";

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
 * Return the corrected time for the specified PHRF rating and elapsed race time.
 * @param {*} elapsedSeconds Seconds since the start of the race.
 * @param {*} phrfRating Rating of the boat.
 * @param {*} isAlternate true to use alternate PHRF system (daytime racing), otherwise use standard for evening racing.
 */
export function getCorrectedTime(elapsedSeconds, phrfRating, isAlternate) {
  return Math.round(
    elapsedSeconds *
      (isAlternate ? getAlternateTOT(phrfRating) : getTOT(phrfRating))
  );
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

export function secondsToHms(seconds) {
  //if (!seconds) return "";

  const isNegative = seconds < 0;

  let duration = Math.abs(seconds);
  let hours = duration / 3600;
  duration = duration % 3600;

  let min = parseInt(duration / 60);
  duration = duration % 60;

  let sec = parseInt(duration);
  if (sec < 10) {
    sec = `${sec}`;
  }
  if (min < 10) {
    min = `${min}`;
  }

  if (parseInt(hours, 10) > 0) {
    return isNegative
      ? `-${parseInt(hours, 10)}h ${min}m ${sec}s`
      : `${parseInt(hours, 10)}h ${min}m ${sec}s`;
  } else if (min == 0) {
    return isNegative ? `-${sec}s` : `${sec}s`;
  } else {
    return isNegative ? `-${min}m ${sec}s` : `${min}m ${sec}s`;
  }
}

export function millisecondsToHms(timeInMiliseconds) {
  let h, m, s;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);

  s < 10 ? (s = `0${s}`) : (s = `${s}`);
  m < 10 ? (m = `0${m}`) : (m = `${m}`);
  h < 10 ? (h = `0${h}`) : (h = `${h}`);

  return `${s}:${m}:${h}`;
}

const millisecondsToDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours}:${minutes}:${seconds}`;
};

export function timeToString(time) {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const diffInMs = (diffInSec - ss) * 100;
  const ms = Math.floor(diffInMs);

  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

export function formatDate(date, showZeroSeconds = false, showAmPm = false) {
  if (showZeroSeconds && showAmPm) {
    return format(date, "h:mm:ss a");
  } else if (showZeroSeconds && !showAmPm) {
    return format(date, "h:mm:ss");
  } else if (!showZeroSeconds && showAmPm) {
    return format(date, "h:mm a");
  }

  return format(date, "h:mm");
}

function printResults(isAlternate = false) {
  getElapsedDiff(boats, 126, 3600, isAlternate).forEach((result) => {
    const timeStamp = secondsToHms(result.diff);
    console.log(`${result.boat.rating} ${result.boat.name} ${timeStamp}`);
  });
}

export function getBoats() {
  return [
    // Object {
    //   "boatName": "Colibri",
    //   "boatType": "Laser 28",
    //   "defaultRating": "FS",
    //   "id": "b7402591-4fcb-4aac-bcf0-bdd8b08f9fbd",
    //   "rating": 126,
    //   "ratingFS": "126",
    //   "ratingNFS": "141",
    //   "sailNumber": "224",
    // },
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
