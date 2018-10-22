class SwapContent {
  constructor(providers, fromCurrency, fromValue, toCurrency) {
    if (Array.isArray(providers))
      throw Error(
        'Supplied providers must be an Array'
      );
    this.setupProviders(providers);
    this.selectedProvider = '';
    this.fromValue = fromValue;
    this.toValue = 0;
    this.fromCurrency = fromCurrency;
    this.toCurrency = toCurrency;
    this.providerData = [];
  }

  setupProviders(providers){
    this.providers = new Map();
    providers.forEach(entry =>{
      this.providers.set(entry.name, entry);
    })

  }

  updateFromValue() {}

  async updateRateEstimate(fromCurrency, toCurrency, fromValue, to) {
    if (this.haveProviderRates) {
      // provide user with feedback prior to rate call return
      // this.loadingData = true;
      this.noProvidersPair = { fromCurrency, toCurrency };
      const providersFound = [];
      // clear the provider information before gathering providers for new pair
      this.selectedProvider = ''; // Reset the selected provider when new rate pair is choosen
      this.toValue = '';
      const callsToMake = [];
      this.providerData = [];
      if (
        +fromValue > 0 &&
        fromCurrency !== toCurrency &&
        !Number.isNaN(+fromValue)
      ) {
        if (this.kyberSwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getKyberRate);
          providersFound.push(this.kyberSwap.name);
        }
        if (this.simplexSwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getSimplexRate);
          providersFound.push(this.simplexSwap.name);
        }
        if (this.bitySwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getBityRate);
          providersFound.push(this.bitySwap.name);
        }
        if (this.changellySwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getChangellyRate);
          providersFound.push(this.changellySwap.name);
        }

        this.providersFound = providersFound;

        const results = await Promise.all(
          callsToMake.map(func =>
            func(fromCurrency, toCurrency, fromValue, this.toValue)
          )
        );
        this.loadingData = false;

        if (
          results.every(
            entry =>
              entry.fromCurrency === this.fromCurrency &&
              entry.toCurrency === this.toCurrency
          )
        ) {
          this.providerData = bestProviderForQuantity(
            results.map(entry => {
              if (+entry.rate > 0) {
                return {
                  provider: entry.provider,
                  fromCurrency,
                  fromValue: 1,
                  toCurrency,
                  rate: +entry.rate,
                  minValue: entry.minValue || 0,
                  maxValue: entry.maxValue || 0
                };
              }
            }),
            this.fromValue
          );
          this.updateEstimate(to);
        }
      }
    }
  }
}
