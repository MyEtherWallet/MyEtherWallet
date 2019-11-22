import {
  maxPethDraw,
  maxEthDraw,
  maxDai,
  getMakerCurrencies,
  displayFixedValue,
  calcLiquidationPrice,
  addresses,
  Vat,
  Spotter,
  GetCdps,
  CdpManager
} from '../makerHelpers';

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
  // assert(!!str, 'argument is falsy');
  // assert(typeof str === 'string', 'argument is not a string');
  return '0x' + Buffer.from(str).toString('hex');
}

export function getLiquidationRatioFor(web3, type) {}

export async function getDustValue(web3, symbol){
  const contract = new web3.eth.Contract(Vat, addresses.MCD_VAT)

  return await contract.methods.ilks(toHex(symbol)).call();
}

export async function getParValue(web3){
  const contract = new web3.eth.Contract(Spotter, addresses.MCD_SPOT);

  return await contract.methods.par().call();
}

export async function getUrns(web3, id, name){
  try {
    /*
    *       this._urnInfoPromise = this._cdpManager
        .getUrn(this.id)
        .then(urn => this._cdpManager.vat.urns(stringToBytes(this.ilk), urn));
        * */
    const contract = new web3.eth.Contract(CdpManager, addresses.CDP_MANAGER);
    const vat = new web3.eth.Contract(Vat, addresses.MCD_VAT);
    console.log(contract.methods); // todo remove dev item
    const urn =  await contract.methods.urns(id).call();
    console.log(urn); // todo remove dev item
    const result = await vat.methods.urns(stringToBytes(name), urn).call();
    console.log('result', result); // todo remove dev item
    return result;
  } catch (e) {
    console.log(e);
  }
}
