const fetch = require('node-fetch')
const fs = require('fs')
<<<<<<< HEAD
const tokenFolder = './src/tokens'
const contractFolder = './src/contracts'
=======
const tokenFolder = './tokens'
const contractFolder = './contracts'
>>>>>>> Add network types, fetch tokens and contracts on build

async function fetchTokens () {
  if(!fs.existsSync(tokenFolder)) {
    fs.mkdirSync(tokenFolder)
  }

<<<<<<< HEAD
  const tokenList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/tokens').then(res => res.json()).catch(err => console.log(err))
  const tokenFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/'
  tokenList.forEach(async (tokenFile) => {
    let tokensCollection = await fetch(`${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${tokenFolder}/tokens-${tokenFile.name}.json`, JSON.stringify(tokensCollection))
=======
  const tokenList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/tokens').then(res => res.json()).catch(err => console.log(err))
  const tokenFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/tokens/'
  tokenList.forEach(async (tokenFile) => {
    let tokensCollection = await fetch(`${tokenFileURL + tokenFile.name}`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${tokenFolder}/${tokenFile.name}`, JSON.stringify(tokensCollection))
>>>>>>> Add network types, fetch tokens and contracts on build
  })
}

async function fetchContracts () {
  if(!fs.existsSync(contractFolder)) {
    fs.mkdirSync(contractFolder)
  }

<<<<<<< HEAD
  const contractList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/contracts').then(res => res.json()).catch(err => console.log(err))
  const contractFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/contracts/'
  contractList.forEach(async (contractFile) => {
    let contractsCollection = await fetch(`${contractFileURL + contractFile.name}/contract-abi-${contractFile.name}.json`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${contractFolder}/contract-abi-${contractFile.name}.json`, JSON.stringify(contractsCollection))
=======
  const contractList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/contracts').then(res => res.json()).catch(err => console.log(err))
  const contractFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/contracts/'
  contractList.forEach(async (contractFile) => {
    let contractsCollection = await fetch(`${contractFileURL + contractFile.name}`).then(res => res.text()).catch(err => console.log(err))
    fs.writeFileSync(`${contractFolder}/${contractFile.name}`, contractsCollection)
>>>>>>> Add network types, fetch tokens and contracts on build
  })
}

function run () {
  fetchTokens()
  fetchContracts()
}

run()
