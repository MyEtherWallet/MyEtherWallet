import bn from 'bignumber.js';
const sizeHex = bytes => {
  return bytes * 2;
};
export default hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  hex = hex.substring(0, hex.lastIndexOf('1') - 1); //starting point
  let offset = hex.length;
  offset -= sizeHex(32);
  const numValues = new bn('0x' + hex.substr(offset, sizeHex(32))).toNumber();
  const values = [];
  for (let i = 0; i < numValues; i++) {
    offset -= sizeHex(1);
    const numBytes = new bn('0x' + hex.substr(offset, sizeHex(1))).toNumber();
    offset -= sizeHex(numBytes);
    values.push(new bn('0x' + hex.substr(offset, sizeHex(numBytes))));
  }
  return values;
};
