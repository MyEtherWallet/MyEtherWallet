/* Accepts string, returns boolean */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

function doesExist(val) {
  return val !== undefined && val !== null;
}

function padLeftEven(hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
}

function formatDate(date) {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const day = days[new Date(date).getDay()];
  const dateString = new Date(date).toLocaleDateString();
  const regExp = /\(([^)]+)\)/;
  const timeString = new Date(date).toTimeString();
  const lengthMinus1 = timeString.length - 1;
  const stripTimezone = timeString
    .slice(timeString.indexOf('(') + 1, lengthMinus1)
    .split(' ')
    .map(item => {
      return item[0];
    })
    .join('');
  const removedTimezone = timeString.replace(regExp, '');
  const removeEndNumber = removedTimezone.slice(0, 12);
  const GMTtime = removeEndNumber.replace(removeEndNumber.slice(5, 8), '');
  const localTime = new Date(date).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${day}. ${dateString} ${GMTtime} - ${localTime} ${stripTimezone}`;
}

export default { isJson, doesExist, padLeftEven, formatDate };
