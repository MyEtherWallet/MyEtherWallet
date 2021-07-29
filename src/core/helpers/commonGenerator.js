import Common, { Hardfork } from '@ethereumjs/common';

const commonGenerator = network => {
  return Common.custom({
    chainId: network.type.chainID,
    defaultHardfork: Hardfork.London
  });
};

export default commonGenerator;
