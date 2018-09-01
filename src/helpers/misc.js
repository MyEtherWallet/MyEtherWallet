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

export default { isJson, doesExists };
