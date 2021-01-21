import Common from 'ethereumjs-common';

const commonGenerator = network => {
  const customCommon = Common.forCustomChain('mainnet', {
    name: network.type.name_long,
    chainId: network.type.chainID
  });
  return new Common(customCommon._chainParams, 'petersburg', ['petersburg']);
};

export default commonGenerator;
