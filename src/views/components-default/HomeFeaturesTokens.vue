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
          <a :href="t.link">
            <div class="d-flex align-center no-link-colors">
              <img :src="t.icon" :alt="t.label" height="20" class="mr-2" />
              <div>{{ t.label }}</div>
            </div>
          </a>
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
import { knuthShuffle } from '@/modules/create-wallet/handlers/helpers';
export default {
  name: 'HomeFeaturesTokens',
  components: {},
  data: vm => ({
    tokens: [
      {
        label: vm.$t('home.features.tokens.usdt'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png'
      },
      {
        label: vm.$t('home.features.tokens.uni'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png'
      },
      {
        label: vm.$t('home.features.tokens.link'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png'
      },
      {
        label: vm.$t('home.features.tokens.usdc'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png'
      },
      {
        label: vm.$t('home.features.tokens.wbtc'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png'
      },
      {
        label: vm.$t('home.features.tokens.cro'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/7310/thumb/cypto.png'
      },
      {
        label: vm.$t('home.features.tokens.aave'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png'
      },
      {
        label: vm.$t('home.features.tokens.okb'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/4463/thumb/okb_token.png'
      },
      {
        label: vm.$t('home.features.tokens.busd'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png'
      },
      {
        label: vm.$t('home.features.tokens.ftt'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9026/thumb/F.png'
      },
      {
        label: vm.$t('home.features.tokens.cusdc'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9442/thumb/Compound_USDC.png'
      },
      {
        label: vm.$t('home.features.tokens.dai'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png'
      },
      {
        label: vm.$t('home.features.tokens.chz'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/8834/thumb/Chiliz.png'
      },
      {
        label: vm.$t('home.features.tokens.ceth'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/10643/thumb/ceth2.JPG'
      },
      {
        label: vm.$t('home.features.tokens.cdai'),
        icon: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/9281/thumb/cDAI.png'
      }
    ],
    ROUTES_HOME: ROUTES_HOME
  }),
  created() {
    fetch(`https://mew-seo-pages.pages.dev/best-wallet-for.json`)
      .then(res => res.json())
      .then(json => {
        const tokenData = json.map(token => {
          return {
            label: `${token.name} (${token.symbol.toUpperCase()})`,
            icon: `https://img.mewapi.io/?image=${token.icon}`,
            link: `https://www.myetherwallet.com/pages${token.path}`
          };
        });
        this.tokens = knuthShuffle(tokenData).slice(0, 15);
      })
      .catch(() => {});
  }
};
</script>

<style lang="scss" scoped>
.no-link-colors {
  color: #1f242f;
}
</style>
