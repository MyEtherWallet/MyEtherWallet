<template>
  <div>
    <div v-for="(coin, idx) in coins" :key="coin + idx">
      <mew-input
        :id="idx"
        :rules="[
          coin.validate ||
            $t('ens.ens-resolver.invalid-addr', { coin: coin.name })
        ]"
        :value="coin.value"
        :label="coin.symbol"
        :placeholder="coin.name + ' ' + $t('common.addr')"
        @input="setCoin"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        @click.native="setMulticoin(setCoins)"
      />
    </div>
  </div>
</template>

<script>
import multicoins from '@/dapps/EnsManagerDapp/handlers/handlerMulticoins';

export default {
  props: {
    setMulticoin: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      setCoins: [],
      coins: []
    };
  },
  mounted() {
    for (const type in multicoins) {
      this.coins.push(multicoins[type]);
    }
  },
  // computed: {
  //   rules() {
  //     return [
  //       this.isValidAddress ||
  //         this.$t('interface.address-book.validations.invalid-address'),
  //       value =>
  //         !!value || this.$t('interface.address-book.validations.addr-required')
  //     ];
  //   }
  // },
  methods: {
    rules(idx, coin) {
      if (coin.value) {
        return [
          this.coins[idx].validate(coin.value) ||
            this.$t('ens.ens-resolver.invalid-addr', { coin: coin.name })
        ];
      }
    },
    setCoin(value, id) {
      const coin = this.coins[id];
      coin.value = coin.validate(value) ? value : '';
      this.setCoins.push(coin);
    }
  }
};
</script>
