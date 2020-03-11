class InterfaceTemplate {
  constructor(props = {}) {}

  static getName() {
    return '';
  }

  static isDex() {
    return false;
  }

  get currencies() {}

  setNetwork(network, web3) {}

  getRate(fromCurrency, toCurrency, fromValue) {}

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {}

  getUpdatedFromCurrencyEntries(value, collectMap) {}

  getUpdatedToCurrencyEntries(value, collectMap) {}

  async startSwap(swapDetails) {}
}
