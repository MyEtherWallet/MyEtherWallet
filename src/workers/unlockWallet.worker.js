import { Wallet } from '@/helpers';

function unlock(file, password) {
  const newFile = {};
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });
  return Wallet.fromV3(newFile, password, true);
}

onmessage = function(event) {
  if (event.data.type === 'unlockWallet') {
    const workerResult = unlock(event.data.data[0], event.data.data[1]);
    postMessage(workerResult);
  }
};
