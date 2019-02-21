const fetch = require('node-fetch');
const fs = require('fs');
const configs = require('./configs');
const tokenList = require('./lists/tokens.json');
const contractList = require('./lists/contracts.json');

const fetchTokens = async () => {
  try {
    if (!fs.existsSync(configs.TOKENS_PATH)) {
      fs.mkdirSync(configs.TOKENS_PATH);
    }
    const tokenFileURL =
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/';
    if (tokenList !== undefined && tokenList.length > 0) {
      for (let i = 0; i < tokenList.length; i++) {
        const tokenFile = tokenList[i];
        const tokensCollection = await fetch(
          `${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        if (tokensCollection !== undefined) {
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

const fetchDarkList = async () => {
  try {
    if (!fs.existsSync(configs.DARKLIST_PATH)) {
      fs.mkdirSync(configs.DARKLIST_PATH);
    }

    const darkList = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
    )
      .then(res => res.json())
      .catch(console.log);
    const jsonToStore = {
      data: darkList,
      timestamp: Date.now()
    };
    fs.writeFileSync(
      `${configs.DARKLIST_PATH}/address-darklist.json`,
      JSON.stringify(jsonToStore)
    );
  } catch (e) {
    console.log(e); // Not captured by sentry
  }
};

const fetchContracts = async () => {
  try {
    if (!fs.existsSync(configs.CONTRACTS_PATH)) {
      fs.mkdirSync(configs.CONTRACTS_PATH);
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
          .catch(err => console.log(err));
        if (contractsCollection !== undefined) {
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
    .then(fetchDarkList);
};

(async () => {
  try {
    await run();
    console.log('Done');
  } catch (e) {
    console.error(e);
  }
})();
