<template>
  <div>
    <div v-for="(coin, idx) in coins" :key="coin + idx">
      <mew-input
        :id="idx"
        class="mb-2"
        :value="coin.value"
        :label="coin.symbol"
        :placeholder="coin.name + ' ' + $t('common.addr')"
        :error-messages="errors[coin.symbol]"
        @input="setCoin"
      />
      <span v-if="coin.error" class="error--text">{{ coin.error }}</span>
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="hasError"
        @click.native="setMulticoin(setCoins)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    setMulticoin: {
      default: function () {
        return {};
      },
      type: Function
    },
    multicoin: {
      type: [Object, null],
      default: null
    }
  },
  data() {
    const errors = {};
    for (const type in this.multicoin) {
      errors[type] = '';
    }
    return {
      setCoins: [],
      errors: errors
    };
  },
  computed: {
    coins() {
      const coins = [];
      for (const type in this.multicoin) {
        coins.push(this.multicoin[type]);
      }
      return coins;
    },
    hasError() {
      return (
        Object.values(this.errors).filter(item => {
          if (item !== '') return item;
        }).length > 0
      );
    }
  },
  methods: {
    setCoin(value, id) {
      const coin = this.coins[id];
      if (coin.validator.validate(value)) {
        const newObj = Object.assign({}, coin, { value: value });
        this.setCoins.push(newObj);
      } else {
        if (value !== '') {
          this.errors[coin.symbol] = this.$t('ens.ens-resolver.invalid-addr', {
            coin: coin.name
          });
        } else {
          this.errors[coin.symbol] = '';
        }
      }
    }
  }
};
</script>
