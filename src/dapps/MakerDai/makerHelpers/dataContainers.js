import { toBigNumber, displayFixedValue } from './helpers';

class CurrencyDetails {
  constructor(value = 0, symbol) {
    this.value =
      typeof value === 'object' ? value.toBigNumber() : toBigNumber(value);
    this.symbol = value.symbol || symbol;
  }

  displayFixed(decimals = 3, round = true) {
    return displayFixedValue(this.value, decimals, round);
  }
}

export function createCurrencyDetails(value, symbol) {
  return new CurrencyDetails(value, symbol);
}
