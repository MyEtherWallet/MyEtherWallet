const fetch = require('node-fetch');
const fs = require('fs');
const tokenFolder = './src/tokens';
const contractFolder = './src/contracts';
const darklistFolder = './src/darklist';

async function fetchTokens() {
  try {
    if (!fs.existsSync(tokenFolder)) {
      fs.mkdirSync(tokenFolder);
    }

    const tokenList = await fetch(
      'https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/tokens'
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    const tokenFileURL =
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/';
    if (tokenList !== undefined && tokenList.length > 0) {
      tokenList.forEach(async tokenFile => {
        let tokensCollection = await fetch(
          `${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        if (tokensCollection !== undefined) {
          fs.writeFileSync(
            `${tokenFolder}/tokens-${tokenFile.name}.json`,
            JSON.stringify(tokensCollection)
          );
        }
      });
    }
  } catch (e) {
    console.error(e); // todo replace with proper error
  }
}

async function fetchDarkList () {
  try {
    if (!fs.existsSync(darklistFolder)) {
      fs.mkdirSync(darklistFolder)
    }

    const darkList = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
    )
    .then(res => res.json())
    .catch(console.log);
    const jsonToStore = {
      'data': darkList,
      'timestamp': Date.now()
    }
    fs.writeFileSync(`${darklistFolder}/address-darklist.json`, JSON.stringify(jsonToStore));
  } catch (e) {
    console.log(e); // todo replace with proper error
  }
}

async function fetchContracts() {
  try {
    if (!fs.existsSync(contractFolder)) {
      fs.mkdirSync(contractFolder);
    }

    const contractList = await fetch(
      'https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/contracts'
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    const contractFileURL =
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/contracts/';
    if (contractList !== undefined && contractList.length > 0) {
      contractList.forEach(async contractFile => {
        let contractsCollection = await fetch(
          `${contractFileURL + contractFile.name}/contract-abi-${
            contractFile.name
          }.json`
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        if (contractsCollection !== undefined) {
          fs.writeFileSync(
            `${contractFolder}/contract-abi-${contractFile.name}.json`,
            JSON.stringify(contractsCollection)
          );
        }
      });
    }
  } catch (e) {
    console.error(e); // todo replace with proper error
  }
}

function run() {
  fetchTokens();
  fetchContracts();
  fetchDarkList();
}

run();
