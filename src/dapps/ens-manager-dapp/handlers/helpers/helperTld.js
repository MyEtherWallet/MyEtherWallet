const tldSupported = (network, name) => {
  if (network.type.ens) {
    const tld = getTld(name, network);
    return tld === network.type.ens.registrarTLD;
  }
  return false;
};

const getTld = (name, network) => {
  const hasTld = name.lastIndexOf('.');
  const splitName = name.split('.');
  const domain = splitName[splitName.length - 1];
  return hasTld > -1 ? domain.toLowerCase() : network.type.ens.registrarTLD;
};

const getHostName = name => {
  return name.substr(
    0,
    name.lastIndexOf('.') > -1 ? name.lastIndexOf('.') : name.length
  );
};

export { tldSupported, getTld, getHostName };
