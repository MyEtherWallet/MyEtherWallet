const fetch = require('node-fetch')
const fs = require('fs')
const tokenFolder = './tokens'
const contractFolder = './contracts'

async function fetchTokens () {
  if(!fs.existsSync(tokenFolder)) {
    fs.mkdirSync(tokenFolder)
  }

  const tokenList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/tokens').then(res => res.json()).catch(err => console.log(err))
  const tokenFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/tokens/'
  tokenList.forEach(async (tokenFile) => {
    let tokensCollection = await fetch(`${tokenFileURL + tokenFile.name}`).then(res => res.json()).catch(err => console.log(err))
    fs.writeFileSync(`${tokenFolder}/${tokenFile.name}`, JSON.stringify(tokensCollection))
  })
}

async function fetchContracts () {
  if(!fs.existsSync(contractFolder)) {
    fs.mkdirSync(contractFolder)
  }

  const contractList = await fetch('https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/contracts').then(res => res.json()).catch(err => console.log(err))
  const contractFileURL = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/contracts/'
  contractList.forEach(async (contractFile) => {
    let contractsCollection = await fetch(`${contractFileURL + contractFile.name}`).then(res => res.text()).catch(err => console.log(err))
    contractsCollection = contractsCollection.replace("'", '');
    fs.writeFileSync(`${contractFolder}/${contractFile.name}`, JSON.stringify(contractsCollection))
  })
}

function run () {
  fetchTokens()
  fetchContracts()
}

run()
