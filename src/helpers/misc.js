/* Accepts string, returns boolean */
function isJson (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

export default {isJson}
