// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring/538-nsc-time-on-time-explained
// https://phrf-lo.org/index.php/handicapping/races-analysis/time-on-time/tot-scoring
import { format } from "date-fns";

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

export function millisecondsToDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
