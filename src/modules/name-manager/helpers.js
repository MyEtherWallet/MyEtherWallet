const tldSupported = (network, name) => {
  if (network.hasOwnProperty('ens')) {
    const tld = getTld(name);
    const isSupported = network.type.ens.supportedTld.find(item => {
      return tld === item;
    });

    return isSupported ? true : false;
  }
  return false;
};

const getTld = name => {
  const splitName = name.split('.');

  return splitName[splitName.length - 1];
};

const getHostName = name => {
  return name.substr(
    0,
    name.lastIndexOf('.') > -1 ? name.lastIndexOf('.') : name.length
  );
};

const decodeCoinAddress = _coinItem => {
  let decodedAddress = '0x';
  if (_coinItem.value !== '' && _coinItem.value) {
    decodedAddress = _coinItem.decode(_coinItem.value);
  }
  return decodedAddress;
};

export { tldSupported, getTld, getHostName, decodeCoinAddress };
