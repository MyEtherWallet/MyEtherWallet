const tldSupported = (network, name) => {
  if (network.type.hasOwnProperty('ens')) {
    const tld = getTld(name, network);
    const isSupported = network.type.ens.supportedTld.find(item => {
      return tld === item;
    });
    return isSupported;
  }
  return false;
};

const getTld = (name, network) => {
  const hasTld = name.lastIndexOf('.');
  const splitName = name.split('.');
  const domain = splitName[splitName.length - 1];
  if (domain && domain !== network.type.ens.registrarTLD) {
    return network.type.ens.registrarTLD;
  }
  return hasTld > -1 ? domain : network.type.ens.registrarTLD;
};

const getHostName = name => {
  return name.substr(
    0,
    name.lastIndexOf('.') > -1 ? name.lastIndexOf('.') : name.length
  );
};

export { tldSupported, getTld, getHostName };
