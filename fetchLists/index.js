const fetch = require('node-fetch');
const fs = require('fs');
const configs = require('./configs');
const contractList = require('./lists/contracts.json');
if (!fs.existsSync(configs.GENERATED_FOLDER_PATH)) {
  fs.mkdirSync(configs.GENERATED_FOLDER_PATH);
}
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

    const response = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/master-file.json'
    )
      .then(res => res.json())
      .then(tokens => {
        const networkTokens = {};
        tokens.forEach(token => {
          token.address = token.contract_address;
          if (networkTokens[token.network])
            networkTokens[token.network].push(token);
          else networkTokens[token.network] = [token];
        });
        const networks = Object.keys(networkTokens);
        for (const network of networks) {
          console.log('Writing tokens for the network: ' + network);
          fs.writeFileSync(
            `${configs.TOKENS_PATH}/tokens-${network}.json`,
            JSON.stringify(networkTokens[network])
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

const run = async () => {
  await fetchContracts().then(fetchMasterFile);
};

(async () => {
  try {
    await run();
    console.log('Done');
  } catch (e) {
    console.error(e);
  }
})();
