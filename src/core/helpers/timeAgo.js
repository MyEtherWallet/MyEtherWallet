const SECONDS_IN_YEAR = 31536000;
const SECONDS_IN_MONTH = 2592000;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTES = 60;

// date is in time string
export default date => {
  const convertedDate = new Date(date);
  const seconds = Math.floor((new Date() - convertedDate) / 1000);
  const secondsInYear = Math.floor(seconds / SECONDS_IN_YEAR);
  const secondsInMonth = Math.floor(seconds / SECONDS_IN_MONTH);
  const secondsInDay = Math.floor(seconds / SECONDS_IN_DAY);
  const secondsInHour = Math.floor(seconds / SECONDS_IN_HOUR);
  const secondsInMin = Math.floor(seconds / SECONDS_IN_MINUTES);

  return secondsInYear > 1
    ? `${secondsInYear} years ago`
    : secondsInMonth > 1
    ? `${secondsInMonth} months ago`
    : secondsInDay > 1
    ? `${secondsInDay} days ago`
    : secondsInHour > 1
    ? `${secondsInHour} hours ago`
    : secondsInMin > 1
    ? `${secondsInMin} minutes ago`
    : `${Math.floor(seconds)} seconds ago`;
};
