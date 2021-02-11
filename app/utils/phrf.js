// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring/538-nsc-time-on-time-explained
// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring

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
      console.log("results", results);
      console.log("referenceCorrectedTime", referenceCorrectedTime);
      console.log("correctedTime", correctedTime);
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
