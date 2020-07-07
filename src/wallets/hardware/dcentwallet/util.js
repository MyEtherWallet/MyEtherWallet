import { coinType } from 'dcent-web-connector/src/type/dcent-web-type';

const getCoinType = path => {
  let type;
  switch (/m\/44'\/(\d+)'/g.exec(path)[1]) {
    case '0':
      type = coinType.BITCOIN;
      break;
    case '1':
      type = coinType.BITCOIN_TESTNET;
      break;
    case '60':
      type = coinType.ETHEREUM;
      break;
    case '137':
      type = coinType.RSK;
      break;
    case '144':
      type = coinType.RIPPLE;
      break;
    case '22':
      type = coinType.MONACOIN;
      break;
    case '8217':
      type = coinType.KLAYTN;
      break;
    default:
      throw new Error('Not Supported path');
  }
  return type;
};
/**
 *
 * @param {String} path
 * @param {Number} idx
 */
const getFullPath = (path, idx) => {
  const pieces = splitPath(path);
  let fullpath = 'm';
  for (let i = 1; i < 6; i++) {
    if (i < pieces.length) {
      fullpath += `/${pieces[i]}`;
    } else if (i === pieces.length) {
      fullpath += `/${idx}`;
    } else {
      fullpath += `/0`;
    }
    if (isHardened(i) && !fullpath.endsWith("'")) {
      fullpath += "'";
    }
  }
  return fullpath;
};
const splitPath = path => {
  return path.split('/').filter(item => item.trim() !== '');
};
const hardenedIdx = [1, 2, 3];
const isHardened = idx => {
  return hardenedIdx.includes(idx);
};
const isHardenedPath = path => {
  const pieces = splitPath(path);
  return hardenedIdx.includes(pieces.length);
};
export { getCoinType, getFullPath, isHardenedPath };
