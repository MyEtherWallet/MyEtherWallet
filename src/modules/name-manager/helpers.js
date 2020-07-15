const tldSupported = (network, name) => {
  if (network.hasOwnProperty('ens')) {
    const tld = getTld(name);
    const isSupported = network.type.ens.supportedTld.find(item => {
      return tld === item;
    });

    return isSupported ? true : false;
  }
  return false;
}

const getTld = (name) => {
  const splitName = name.split('.');

  return splitName[splitName.length - 1];
}

export {
  tldSupported,
  getTld
}
