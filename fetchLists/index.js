const fetch = require('node-fetch');
const fs = require('fs');
const configs = require('./configs');
const contractList = require('./lists/contracts.json');
const IMAGE_PROXY = 'https://img.mewapi.io/?image=';
if (!fs.existsSync(configs.GENERATED_FOLDER_PATH)) {
  fs.mkdirSync(configs.GENERATED_FOLDER_PATH);
}
const getFormattedList = async (url, network) => {
  const response = await fetch(url);
  const data = await response.json();
  const tokens = Object.values(data.tokens)
    .map(t => {
      t.contract_address = t.address.toLowerCase();
      t.icon = IMAGE_PROXY + t.logoURI;
      t.icon_png = IMAGE_PROXY + t.logoURI;
      t.network = network;
      delete t.logoURI;
      delete t.chainId;
      return t;
    })
    .filter(t => t.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  return tokens;
};
const fetchOneInchLists = async () => {
  const ethTokens = await getFormattedList(
    'https://api.1inch.exchange/v3.0/1/tokens',
    'eth'
  );
  const bscTokens = await getFormattedList(
    'https://api.1inch.exchange/v3.0/56/tokens',
    'bsc'
  );
  const maticTokens = await getFormattedList(
    'https://api.1inch.exchange/v3.0/137/tokens',
    'matic'
  );
  return {
    eth: ethTokens,
    bsc: bscTokens,
    matic: maticTokens
  };
};
const fetchCGtokenList = async () => {
  const ethTokens = await getFormattedList(
    'https://requestcache.mewapi.io/?url=https://tokens.coingecko.com/ethereum/all.json',
    'eth'
  );
  const bscTokens = await getFormattedList(
    'https://requestcache.mewapi.io/?url=https://tokens.coingecko.com/binance-smart-chain/all.json',
    'bsc'
  );
  const maticTokens = await getFormattedList(
    'https://requestcache.mewapi.io/?url=https://tokens.coingecko.com/polygon-pos/all.json',
    'matic'
  );
  return {
    eth: ethTokens,
    bsc: bscTokens,
    matic: maticTokens
  };
};
const fetchContracts = async () => {
  try {
    if (!fs.existsSync(configs.CONTRACTS_PATH)) {
      fs.mkdirSync(configs.CONTRACTS_PATH);
    }
    if (!fs.existsSync(configs.TOKENS_PATH)) {
      fs.mkdirSync(configs.TOKENS_PATH);
    }
    const contractFileURL =
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/contracts/';
    if (contractList !== undefined && contractList.length > 0) {
      for (let i = 0; i < contractList.length; i++) {
        const contractFile = contractList[i];
        const contractsCollection = await fetch(
          `${contractFileURL + contractFile.name}/contract-abi-${
            contractFile.name
          }.json`
        )
          .then(res => res.json())
          .then(json => {
            if (json.length === 1 && json[0].name === 'TEST') return [];
            return json;
          })
          .catch(err => console.log(err));
        if (contractsCollection !== undefined) {
          console.log('Writing contract for the network: ' + contractFile.name);
          fs.writeFileSync(
            `${configs.CONTRACTS_PATH}/contract-abi-${contractFile.name}.json`,
            JSON.stringify(contractsCollection)
          );
        }
      }
    }
  } catch (e) {
    console.error(e); // todo replace with proper error
  }
};

const fetchMasterFile = async () => {
  try {
    if (!fs.existsSync(configs.MASTER_FILE_PATH)) {
      fs.mkdirSync(configs.MASTER_FILE_PATH);
    }
    const oneInchTokens = await fetchOneInchLists();
    const CGTokens = await fetchCGtokenList();
    const response = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/master-file.json'
    )
      .then(res => res.json())
      .then(tokens => {
        const networkTokens = {};
        tokens.forEach(token => {
          token.contract_address = token.contract_address.toLowerCase();
          token.address = token.contract_address;
          if (token.icon !== '') {
            token.icon = IMAGE_PROXY + token.icon;
            token.icon_png = IMAGE_PROXY + token.icon_png;
          }
          delete token.link;
          if (!networkTokens[token.network]) networkTokens[token.network] = {};
          networkTokens[token.network][token.address] = token;
        });
        const oneInchNetworks = Object.keys(oneInchTokens);
        for (const network of oneInchNetworks) {
          if (!networkTokens[network]) networkTokens[network] = {};
          oneInchTokens[network].forEach(t => {
            t.address = t.address.toLowerCase();
            if (!networkTokens[network][t.address]) {
              networkTokens[network][t.address] = t;
              tokens.push(t);
            } else if (!networkTokens[network][t.address].icon) {
              networkTokens[network][t.address].icon = t.icon;
              networkTokens[network][t.address].icon_png = t.icon_png;
            }
          });
        }
        const CGNetworks = Object.keys(CGTokens);
        for (const network of CGNetworks) {
          if (!networkTokens[network]) networkTokens[network] = {};
          CGTokens[network].forEach(t => {
            t.address = t.address.toLowerCase();
            if (!networkTokens[network][t.address]) {
              networkTokens[network][t.address] = t;
              tokens.push(t);
            } else if (!networkTokens[network][t.address].icon) {
              networkTokens[network][t.address].icon = t.icon;
              networkTokens[network][t.address].icon_png = t.icon_png;
            }
          });
        }
        const networks = Object.keys(networkTokens);
        for (const network of networks) {
          console.log('Writing tokens for the network: ' + network);
          fs.writeFileSync(
            `${configs.TOKENS_PATH}/tokens-${network}.json`,
            JSON.stringify(Object.values(networkTokens[network]))
          );
        }
        return tokens;
      })
      .catch(console.log);
    console.log('Writing masterfile');
    fs.writeFileSync(
      `${configs.MASTER_FILE_PATH}/master-file.json`,
      JSON.stringify(response)
    );
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};
const fetchPlatformCoinList = async () => {
  const list = await fetch(
    'https://api.coingecko.com/api/v3/coins/list?include_platform=true'
  )
    .then(res => res.json())
    .then(l => {
      const idmap = {};
      l.forEach(t => {
        const vals = Object.values(t.platforms);
        vals.forEach(val => {
          if (val) idmap[val] = t.id;
        });
      });
      return idmap;
    })
    .catch(console.error);
  fs.writeFileSync(
    configs.MASTER_FILE_PATH + '/platformlist.json',
    JSON.stringify(list)
  );
};
const run = async () => {
  await fetchContracts().then(fetchMasterFile).then(fetchPlatformCoinList);
};

(async () => {
  try {
    await run();
    console.log('Done');
  } catch (e) {
    console.error(e);
  }
})();
