<template>
  <div>
    <access-my-wallet-container />
    <price-bar :v-if="online && tokens.length > 1" :tokens="tokens" />
    <faqs />
  </div>
</template>

<script>
import AccessMyWalletContainer from './containers/AccessMyWalletContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import PriceBar from './components/PriceBar';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';

export default {
  name: 'AccessWalletLayout',
  components: {
    'access-my-wallet-container': AccessMyWalletContainer,
    faqs: FaqsContainer,
    'price-bar': PriceBar
  },
  data() {
    return {
      tokens: []
    };
  },
  computed: {
    ...mapGetters({
      online: 'online'
    })
  },
  async mounted() {
    if (this.online) {
      this.tokens = await this.getRates();
    }
  },
  methods: {
    async getRates() {
      this.tokens = [];
      const tokenNames = [
        'BTC',
        'ETH',
        'EOS',
        'XRP',
        'BCH',
        'LTC'
      ];
      const rates = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=' + tokenNames.join(',')
      )
        .then(res => {
          return res.json();
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      return Object.keys(rates.data)
        .map(item => Object.assign(rates.data[item]))
        .sort((a, b) => {
          if (a.market_cap_rank < b.market_cap_rank) return -1;
          if (a.market_cap_rank > b.market_cap_rank) return 1;
          return 0;
        })
        .filter(item => {
          if (
            tokenNames.find(el => {
              return el === item.symbol;
            }) !== undefined
          ) {
            return item;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessWalletLayout.scss';
</style>
