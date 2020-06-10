import TokenBalance from '@myetherwallet/eth-token-balance';
import nodeList from '@/networks';
import masterFile from '@/_generated/master-file.json';
import bigNumber from 'bignumber.js';
import Web3 from 'web3';

const tokenContractSupports = [1, 3];

const addIconsToTokens = (tokens, network) => {
  const copyTokens = [];
  const { toChecksumAddress } = Web3.utils;
  tokens.forEach(cToken => {
    const foundInMasterfile = masterFile.find(item => {
      return (
        toChecksumAddress(item.contract_address) ===
        toChecksumAddress(cToken.addr)
      );
    });
    cToken.logo = {
      src:
        foundInMasterfile.icon_png !== ''
          ? foundInMasterfile.icon_png
          : foundInMasterfile.icon !== ''
          ? foundInMasterfile.icon
          : network.type.icon
    };
    copyTokens.push(cToken);
  });

  return copyTokens;
};

const combineTokens = (tokens, network) => {
  const { _ } = Web3.utils;
  return _.union(tokens, nodeList[network.type.name]);
};

const setBalance = tokens;

const getTokens = async (network, accountAddress) => {
  const web3 = new Web3(network.url);
  const tcSupport = tokenContractSupports.find(item => {
    return item === network.type.chainId;
  });

  if (tcSupport) {
    const tb = new TokenBalance(web3.currentProvider);
    const tokens = await tb.getBalance(accountAddress, true, true, true, {
      gas: '0x11e1a300'
    });

    console.log(tokens);
    const addIcons = addIconsToTokens(tokens, network);
    // return tokens;
  }
};

if (
  !navigator.userAgent.includes('Node.js') &&
  !navigator.userAgent.includes('jsdom')
) {
  onmessage = async event => {
    if (event.data.type === 'getTokens') {
      // param 0 network
      // param 2 address
      const workerResult = await getTokens(
        event.data.data[0],
        event.data.data[1]
      );
      postMessage(workerResult);
    } else {
      postMessage(new Error('Worker function not recognized!'));
    }
  };
}
