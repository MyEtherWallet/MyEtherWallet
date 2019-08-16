import {
  SwapProviders,
  providers
} from '@/partners';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('partners', () => {
  xit('[INTENTIONALLY SKIPPED] should instanciate a new instance', async done => {
    console.log(providers.filter(part => !part.isDex())); // todo remove dev item
    const swap = new SwapProviders(
      providers.filter(part => !part.isDex),
      {
        network: 'ETH',
        getRateForUnit: false
      },
      { tokensWithBalance: [] }
    )
    const interval = setInterval(async () => {
      console.log(swap.haveProviderRates); // todo remove dev item
      if (swap.haveProviderRates) {
        clearInterval(interval)
        const reault = await swap.updateRateEstimate(
          'ETH',
          'BTC',
          1,
          'to'
        );
        console.log(reault); // todo remove dev item
        done();
      }
    }, 1000);
  });
});
