const decodeCoinAddress = _coinItem => {
  let decodedAddress = '0x';
  if (_coinItem.value !== '' && _coinItem.value) {
    decodedAddress = _coinItem.decode(_coinItem.value);
  }
  return decodedAddress;
};

export { decodeCoinAddress };
