import uuid from 'uuid/v4';

const mapToObject = map => {
  const obj = {};
  for (const prop of map) {
    obj[prop[0]] = prop[1];
  }
  return obj;
};

const getTimeRemaining = (timestamp, validFor = 600) => {
  return (
    validFor - parseInt((new Date().getTime() - Date.parse(timestamp)) / 1000)
  );
};

const getTimeRemainingString = timestamp => {
  const timeRemaining = getTimeRemaining(timestamp);
  if (timeRemaining < 0) {
    return 'expired';
  }
  const seconds = Math.floor(timeRemaining % 60);
  const minutes = Math.floor((timeRemaining / 60) % 60);
  return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
};

function buildPayload(method, data) {
  return {
    jsonrpc: '2.0',
    method: method,
    params: data,
    id: uuid()
  };
}

export { mapToObject, getTimeRemaining, getTimeRemainingString, buildPayload };
