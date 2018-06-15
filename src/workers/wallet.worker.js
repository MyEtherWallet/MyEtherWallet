import { Wallet } from '@/helpers'


function create (password) {
  let createdWallet = {}
  const wallet = new Wallet.generate()
  createdWallet.walletJson = wallet.createJson(password)
  // createdWallet.walletJson = walletJson // Wallet.createBlob('mime', walletJson)
  createdWallet.name = wallet.getV3FileName()
  // console.log(createdWallet) // todo remove dev item
  return createdWallet
}

onmessage = function (event) {
  // console.log('1') // todo remove dev item
  if (event.data.type === 'createWallet') {
    // console.log('createWallet', event) // todo remove dev item
    let workerResult = create(event.data.data[0])
    console.log(workerResult) // todo remove dev item
    postMessage(workerResult)
  }
}

