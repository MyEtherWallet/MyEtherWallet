import TokenBalance from '@myetherwallet/eth-token-balance';
// import nodeList from '@/networks';
import masterFile from '@/_generated/master-file.json';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import sortByBalance from '@/helpers/sortByBalance.js';

const tokenContractSupports = [1, 3];

const addIconsToTokens = (tokens, network) => {
  const { toChecksumAddress } = Web3.utils;
  return tokens.map(cToken => {
    const foundInMasterfile = masterFile.find(item => {
      return (
        toChecksumAddress(item.contract_address) ===
        toChecksumAddress(cToken.addr)
      );
    });
    if (foundInMasterfile) {
      if (cToken.hasOwnProperty('logo')) {
        const logo = cToken['logo'];
        cToken['logo'].src =
          foundInMasterfile.icon_png !== ''
            ? `https://img.mewapi.io/?image=${foundInMasterfile.icon_png}&width=50&height=50&fit=scale-down`
            : foundInMasterfile.icon !== ''
            ? `https://img.mewapi.io/?image=${foundInMasterfile.icon}&width=50&height=50&fit=scale-down`
            : logo.src !== ''
            ? `https://img.mewapi.io/?image=${logo.src}&width=50&height=50&fit=scale-down`
            : network.type.icon;
      } else {
        cToken['logo'] = {
          src:
            foundInMasterfile.icon_png !== ''
              ? `https://img.mewapi.io/?image=${foundInMasterfile.icon_png}&width=50&height=50&fit=scale-down`
              : foundInMasterfile.icon !== ''
              ? `https://img.mewapi.io/?image=${foundInMasterfile.icon}&width=50&height=50&fit=scale-down`
              : network.type.icon
        };
      }
    } else {
      if (cToken.hasOwnProperty('logo')) {
        const logo = cToken['logo'];
        cToken['logo'].src =
          logo.src !== ''
            ? `https://img.mewapi.io/?image=${logo.src}&width=50&height=50&fit=scale-down`
            : network.type.icon;
      }
    }
    return cToken;
  });
};

const combineTokens = (tokens, network) => {
  const { _ } = Web3.utils;
  return _.union(tokens, network.type.tokens);
};

const formatTokenBalance = tokens => {
  return tokens.map(item => {
    const denominator = new BigNumber(10).pow(item.decimals);
    const balance =
      item.hasOwnProperty('balance') && item.balance !== 0
        ? new BigNumber(item.balance).div(denominator).toString()
        : 0;
    item.balance = balance;
    return item;
  });
};

const getTokens = async (network, address) => {
  const web3 = new Web3(network.url);
  const tcSupport = tokenContractSupports.find(item => {
    return item === network.type.chainID;
  });

  if (tcSupport) {
    const tb = new TokenBalance(web3.currentProvider);
    const tokens = await tb.getBalance(address, true, true, true, {
      gas: '0x11e1a300'
    });

    const combinedIcons = combineTokens(tokens, network);
    const addIcons = addIconsToTokens(combinedIcons, network);
    const formatBalance = formatTokenBalance(addIcons);
    const sortByName = formatBalance.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
      } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
      }
      return 0;
    });
    const sortedBalance = sortByName.sort(sortByBalance);
    return sortedBalance;
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
