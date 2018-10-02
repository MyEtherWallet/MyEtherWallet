import { Wallet } from '@/helpers';
export default (password, keyObject) => {
  const newFile = {};
  Object.keys(keyObject).forEach(key => {
    newFile[key.toLowerCase()] = keyObject[key];
  });
  return new Promise((resolve, reject) => {
    Wallet.recover(password, newFile, privKey => {
      if (privKey instanceof Error) reject(privKey);
      else resolve(privKey);
    });
  });
};
