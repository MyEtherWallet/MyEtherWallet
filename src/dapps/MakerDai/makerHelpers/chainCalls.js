import { addresses, Vat, Spotter, GetCdps, CdpManager } from '../makerHelpers';
import assert from 'assert';

function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign ? sign : '0');
}

function toHex(str, { with0x = true, rightPadding = 64 } = {}) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  if (rightPadding > 0) result = padRight(result, rightPadding);
  return with0x ? '0x' + result : result;
}

function stringToBytes(str) {
  return '0x' + Buffer.from(str).toString('hex');
}

function bytesToString(hex) {
  return Buffer.from(hex.replace(/^0x/, ''), 'hex')
    .toString()
    .replace(/\x00/g, ''); // eslint-disable-line no-control-regex
}

export async function getCdpIds(web3, proxyAddress) {
  const contract = new web3.eth.Contract(GetCdps, addresses.GET_CDPS);
  const results = await contract.methods
    .getCdpsDesc(addresses.CDP_MANAGER, proxyAddress)
    .call();
  const ids = results.ids;
  const ilks = results.ilks;
  assert(ids.length === ilks.length, 'ids and ilks must be the same length');
  const collected = ids.map((id, index) => {
    return { id: parseInt(id), ilk: bytesToString(ilks[index]) };
  });
  return collected;
}

export async function getDustValue(web3, symbol) {
  const contract = new web3.eth.Contract(Vat, addresses.MCD_VAT);

  return await contract.methods.ilks(toHex(symbol)).call();
}

export async function getParValue(web3) {
  const contract = new web3.eth.Contract(Spotter, addresses.MCD_SPOT);

  return await contract.methods.par().call();
}

export async function getUrns(web3, id, name) {
  try {
    const contract = new web3.eth.Contract(CdpManager, addresses.CDP_MANAGER);
    const vat = new web3.eth.Contract(Vat, addresses.MCD_VAT);
    const urn = await contract.methods.urns(id).call();
    const result = await vat.methods.urns(stringToBytes(name), urn).call();
    return result;
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
  }
}
