import {
  Wallet
} from '@/helpers'

function unlock(file, password) {
  console.log(file, password)
  return Wallet.fromV3(file, password)
}

onmessage = function(event) {
  if (event.data.type === 'unlockWallet') {
    let workerResult = unlock(event.data.data[0], event.data.data[1])
    postMessage(workerResult)
  }
}
