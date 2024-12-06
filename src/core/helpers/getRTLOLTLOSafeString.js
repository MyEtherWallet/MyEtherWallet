const fixedHex = (number, length) => {
  let str = number.toString(16).toUpperCase();
  while (str.length < length) str = '0' + str;
  return str;
};

/* Creates a unicode literal based on the string */
const unicodeLiteral = str => {
  let i;
  let result = '';
  for (i = 0; i < str.length; ++i) {
    if (str.charCodeAt(i) > 126 || str.charCodeAt(i) < 32)
      result += '\\u' + fixedHex(str.charCodeAt(i), 4);
    else result += str[i];
  }
  return result;
};
export const getRTLOLTLOSafeString = str => {
  const isrtloltlo = /[\u202E\u200F]/.test(str) || /[\u202D\u200E]/.test(str);
  if (isrtloltlo) return unicodeLiteral(str);
  return str;
};
