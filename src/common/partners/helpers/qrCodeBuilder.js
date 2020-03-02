const BTC = addr => {
  return `bitcoin:${addr}`;
};

const BCH = addr => {
  return `bitcoincash:${addr}`;
};

export default (address, coin) => {
  switch (coin) {
    case 'BTC':
      return BTC(address);
    case 'BCH':
      return BCH(address);
    default:
      return address;
  }
};
