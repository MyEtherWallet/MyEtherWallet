const fetch = require('node-fetch')
const fs = require('fs')
const tokenFolder = './src/tokens'
const contractFolder = './src/contracts'

async function fetchTokens () {
  if(!fs.existsSync(tokenFolder)) {
    fs.mkdirSync(tokenFolder)
  }

  const tokenList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/tokens').then(res => res.json()).catch(err => console.log(err))
  const tokenFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/'
  tokenList.forEach(async (tokenFile) => {
    let tokensCollection = await fetch(`${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${tokenFolder}/tokens-${tokenFile.name}.json`, JSON.stringify(tokensCollection))
  })
}

async function fetchContracts () {
  if(!fs.existsSync(contractFolder)) {
    fs.mkdirSync(contractFolder)
  }

  const contractList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/contracts').then(res => res.json()).catch(err => console.log(err))
  const contractFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/contracts/'
  contractList.forEach(async (contractFile) => {
    let contractsCollection = await fetch(`${contractFileURL + contractFile.name}/contract-abi-${contractFile.name}.json`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${contractFolder}/contract-abi-${contractFile.name}.json`, JSON.stringify(contractsCollection))
  })
}

function run () {
  fetchTokens()
  fetchContracts()
}

run()
