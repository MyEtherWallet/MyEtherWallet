import supportedCoins from '../dapps/ManageENS/supportedCoins';
import ResolverAbi from '../dapps/ManageENS/ABI/resolverAbi.js';
import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
const getMultiCoinAddress = (ens, name, coinType) => {
  return new Promise((resolve, reject) => {
    if (!supportedCoins[coinType]) return reject();
    if (!Misc.isValidENSAddress(name)) return reject();
    ens
      .resolver(normalise(name), ResolverAbi)
      .addr(supportedCoins[coinType].id)
      .then(bytes => {
        if (bytes) {
          resolve(
            supportedCoins[coinType].encode(
              new Buffer(bytes.replace('0x', ''), 'hex')
            )
          );
        } else {
          reject();
        }
      })
      .catch(reject);
  });
};
export default getMultiCoinAddress;
