// import {Wallet} from '@/helpers/'

// function GenerateKeystoreWallet (password, opts) {
//   const wallet = new Wallet.generate
//   const jsonWallet = wallet.createJson(password, {kdf: 'scrypt', n: (262144 / 2)})
//   return Wallet.createBlob("text/json;charset=UTF-8", jsonWallet)
// }
//
onmessage = function (e) {
  const data = e.data

  console.log(data)
}

export default onmessage
