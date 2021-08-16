import * as nameHashPckg from 'eth-ens-namehash';
const normalise = function (str) {
  return nameHashPckg.normalize(str);
};

export default normalise;
