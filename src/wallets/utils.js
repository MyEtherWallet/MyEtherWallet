const getBufferFromHex = hex => {
  const _hex = hex.toLowerCase().replace('0x', '');
  return new Buffer(_hex, 'hex');
};
export { getBufferFromHex };
