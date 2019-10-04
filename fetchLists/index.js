const fetch = require('node-fetch');
const fs = require('fs');
const configs = require('./configs');
const tokenList = require('./lists/tokens.json');
const contractList = require('./lists/contracts.json');
//fsdfs

const fetchTokens = async () => {
  try {
    if (!fs.existsSync(configs.TOKENS_PATH)) {
      fs.mkdirSync(configs.TOKENS_PATH);
    }
    const tokenFileURL =
      'https://cdn.jsdelivr.net/gh/MyEtherWallet/ethereum-lists@master/dist/tokens/';
    if (tokenList !== undefined && tokenList.length > 0) {
      for (let i = 0; i < tokenList.length; i++) {
        const tokenFile = tokenList[i];
        const tokensCollection = await fetch(
          `${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        if (tokensCollection !== undefined) {
          console.log('Writing tokens for the network: ' + tokenFile.name);
          fs.writeFileSync(
            `${configs.TOKENS_PATH}/tokens-${tokenFile.name}.json`,
            JSON.stringify(tokensCollection)
          );
        }
      }
    }
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};

const fetchAddressDarkList = async () => {
  try {
    if (!fs.existsSync(configs.ADDRESS_DARKLIST_PATH)) {
      fs.mkdirSync(configs.ADDRESS_DARKLIST_PATH);
    }

    const darkList = await fetch(
      'https://cdn.jsdelivr.net/gh/MyEtherWallet/ethereum-lists@master/src/addresses/addresses-darklist.json'
    )
      .then(res => res.json())
      .catch(console.log);
    const jsonToStore = {
      data: darkList,
      timestamp: Date.now()
    };
    console.log('Writing address darklist');
    fs.writeFileSync(
      `${configs.ADDRESS_DARKLIST_PATH}/address-darklist.json`,
      JSON.stringify(jsonToStore)
    );
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};

const fetchUrlDarklist = async () => {
  const sources = [
    {
      repo:
        'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/blacklists/domains.json',
      identifier: 'eal'
    },
    {
      repo:
        'https://raw.githubusercontent.com/iosiro/counter_phishing_blacklist/master/blacklists/domains.json',
      identifier: 'iosiro'
    },
    {
      repo:
        'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/blacklists/domains.json',
      identifier: 'phishfort'
    },
    {
      repo:
        'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/urls/urls-darklist.json',
      identifier: 'mew'
    }
  ];
  try {
    const promises = [];
    if (!fs.existsSync(configs.URL_DARKLIST_PATH)) {
      fs.mkdirSync(configs.URL_DARKLIST_PATH);
    }

    for (let i = 0; i < sources.length; i++) {
      console.log(`Writing url darklist from ${sources[i].identifier}`);
      const fetchedProm = await fetch(sources[i].repo).then(res => res.json());
      promises.push(fetchedProm);
    }

    await Promise.all(promises).then(values => {
      values.forEach((res, idx) => {
        if (sources[idx].identifier === 'mew') {
          const newRes = res.map(item => {
            return item.id;
          });

          fs.writeFileSync(
            `${configs.URL_DARKLIST_PATH}/${
              sources[idx].identifier
            }-blacklisted-domains.json`,
            JSON.stringify(newRes)
          );
        } else {
          fs.writeFileSync(
            `${configs.URL_DARKLIST_PATH}/${
              sources[idx].identifier
            }-blacklisted-domains.json`,
            JSON.stringify(res)
          );
        }
      });
    });
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};

const fetchUrlLightlist = async () => {
  const sources = [
    {
      repo:
        'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/whitelists/domains.json',
      identifier: 'eal'
    },
    {
      repo:
        'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/urls/urls-lightlist.json',
      identifier: 'mew'
    }
  ];
  try {
    const promises = [];
    if (!fs.existsSync(configs.URL_LIGHTLIST_PATH)) {
      fs.mkdirSync(configs.URL_LIGHTLIST_PATH);
    }
    for (let i = 0; i < sources.length; i++) {
      console.log(`Writing url lightlist from ${sources[i].identifier}`);
      const fetchedProm = await fetch(sources[i].repo).then(res => res.json());
      promises.push(fetchedProm);
    }

    await Promise.all(promises).then(values => {
      values.forEach((res, idx) => {
        if (sources[idx].identifier === 'mew') {
          const newRes = res.map(item => {
            return item.id;
          });

          fs.writeFileSync(
            `${configs.URL_LIGHTLIST_PATH}/${
              sources[idx].identifier
            }-whitelisted-domains.json`,
            JSON.stringify(newRes)
          );
        } else {
          fs.writeFileSync(
            `${configs.URL_LIGHTLIST_PATH}/${
              sources[idx].identifier
            }-whitelisted-domains.json`,
            JSON.stringify(res)
          );
        }
      });
    });
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};

const fetchContracts = async () => {
  try {
    if (!fs.existsSync(configs.CONTRACTS_PATH)) {
      fs.mkdirSync(configs.CONTRACTS_PATH);
    }

    const contractFileURL =
      'https://cdn.jsdelivr.net/gh/MyEtherWallet/ethereum-lists@master/dist/contracts/';
    if (contractList !== undefined && contractList.length > 0) {
      for (let i = 0; i < contractList.length; i++) {
        const contractFile = contractList[i];
        const contractsCollection = await fetch(
          `${contractFileURL + contractFile.name}/contract-abi-${
            contractFile.name
          }.json`
        )
          .then(res => res.json())
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

const run = async () => {
  await fetchTokens()
    .then(fetchContracts)
    .then(fetchAddressDarkList)
    .then(fetchUrlDarklist)
    .then(fetchUrlLightlist);
};

(async () => {
  try {
    await run();
    console.log('Done');
  } catch (e) {
    console.error(e);
  }
})();
