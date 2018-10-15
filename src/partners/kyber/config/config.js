const kyberAddressFallback = {
  ETH: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
  ROP: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755'
};

// TODO: look into only using kyberTokenInfoList for ETH and parsing results differently if ROP?
const kyberTokenList = {
  ETH: 'https://tracker.kyber.network/api/tokens/supported',
  ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
};

const kyberTokenInfoList = {
  ETH: 'https://tracker.kyber.network/api/tokens/pairs'
};

const kyberValidNetworks = ['ETH', 'ROP'];

export {
  kyberAddressFallback,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks
};
