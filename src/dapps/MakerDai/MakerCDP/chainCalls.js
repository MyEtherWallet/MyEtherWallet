import {
  maxPethDraw,
  maxEthDraw,
  maxDai,
  getMakerCurrencies,
  displayFixedValue,
  calcLiquidationPrice,
  addresses,
  Vat,
  Spotter
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

export function getLiquidationRatioFor(web3, type) {}

export async function getDustValue(web3, symbol){
  const contract = new web3.eth.Contract(Vat, addresses.MCD_VAT)

  return await contract.methods.ilks(toHex(symbol)).call();
}

export async function getParValue(web3){
  const contract = new web3.eth.Contract(Spotter, addresses.MCD_SPOT);

  return await contract.methods.par().call();
}
