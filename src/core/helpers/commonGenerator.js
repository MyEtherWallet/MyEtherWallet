import Common from '@ethereumjs/common';

const commonGenerator = network => {
  return Common.custom({ chainId: network.type.chainID });
};

export default commonGenerator;
