<template>
  <div>
    <div v-for="(coin, idx) in coins" :key="coin + idx">
      <mew-input
        :id="idx"
        class="mb-2"
        :rules="[
          v =>
            coin.validator.validate(v) ||
            $t('ens.ens-resolver.invalid-addr', { coin: coin.name })
        ]"
        :value="coin.value"
        :label="coin.symbol"
        :placeholder="coin.name + ' ' + $t('common.addr')"
        @input="setCoin"
      />
      <span v-if="coin.error" class="error--text">{{ coin.error }}</span>
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
      setCoins: []
    };
  },
  computed: {
    coins() {
      const coins = [];
      for (const type in multicoins) {
        coins.push(multicoins[type]);
      }
      return coins;
    }
  },
  methods: {
    setCoin(value, id) {
      const coin = this.coins[id];
      if (coin.validator.validate(value)) {
        coin.value = value;
        this.setCoins.push(coin);
      }
    }
  }
};
</script>
