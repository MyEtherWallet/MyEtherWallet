/* Accepts string, returns boolean */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

function doesExists(val) {
  return val !== undefined && val !== null;
}

function padLeftEven(hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
}

export default { isJson, doesExists, padLeftEven };
