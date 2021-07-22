<template>
  <mew6-white-sheet
    class="mew-component--features-tokens pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">
      {{ $t('home.features.tokens.heading') }}
    </div>
    <div class="mt-10">
      <v-row>
        <v-col v-for="(t, k) in tokens" :key="k" cols="12" lg="4" sm="6">
          <div class="d-flex align-center">
            <img :src="t.icon" :alt="t.label" height="20" class="mr-2" />
            <div>{{ t.label }}</div>
          </div>
        </v-col>
      </v-row>
      <mew-button
        title="Get tokens"
        btn-size="xlarge"
        class="mx-auto mt-12 d-block"
        @click.native="
          $router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME, params: {} })
        "
      />
    </div>
  </mew6-white-sheet>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'HomeFeaturesTokens',
  components: {},
  data: () => ({
    tokens: [
      {
        label: 'Tether (USDT)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png'
      },
      {
        label: 'Uniswap (UNI)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png'
      },
      {
        label: 'Chainlink (LINK)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png'
      },
      {
        label: 'USD Coin (USDC)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png'
      },
      {
        label: 'Wrapped Bitcoin (WBTC)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png'
      },
      {
        label: 'Crypto.com Coin (CRO)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/7310/thumb/cypto.png'
      },
      {
        label: 'Aave (AAVE)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png'
      },
      {
        label: 'OKB (OKB)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/4463/thumb/okb_token.png'
      },
      {
        label: 'Binance USD (BUSD)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png'
      },
      {
        label: 'FTX Token (FTT)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9026/thumb/F.png'
      },
      {
        label: 'cUSDC (CUSDC)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9442/thumb/Compound_USDC.png'
      },
      {
        label: 'Dai (DAI)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png'
      },
      {
        label: 'Chiliz (CHZ)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/8834/thumb/Chiliz.png'
      },
      {
        label: 'cETH (CETH)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/10643/thumb/ceth2.JPG'
      },
      {
        label: 'cDAI (CDAI)',
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9281/thumb/cDAI.png'
      }
    ],
    ROUTES_HOME: ROUTES_HOME
  })
};
</script>

<style lang="scss" scoped></style>
