<template>
  <div class="full-width">
    <div v-for="(coin, idx) in coins" :key="coin + idx">
      <mew-input
        :id="idx"
        v-model="setCoins[coin]"
        :label="coin"
        class="mb-2"
        :placeholder="coin + ' ' + $t('common.addr')"
        :error-messages="errors[coin]"
        @input="validateCoin"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="!valid"
        @click.native="submit"
      />
    </div>
  </div>
</template>

<script>
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import { clone } from 'underscore';
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
    const coins = {};
    for (const type in this.multicoin) {
      errors[type] = '';
      coins[type] = this.multicoin[type].value;
    }
    return {
      setCoins: coins,
      errors: errors
    };
  },
  computed: {
    coins() {
      return Object.keys(this.setCoins);
    },
    hasError() {
      return (
        Object.values(this.errors).filter(item => {
          if (item !== '') return item;
        }).length > 0
      );
    },
    valid() {
      const hasValues = Object.values(this.setCoins).filter(item => {
        if (item && item.value !== '') return item;
      });

      return hasValues.length > 0 && !this.hasError;
    }
  },
  watch: {
    multicoin: {
      handler: function (newVal) {
        if (newVal) {
          for (const type in newVal) {
            this.setCoins[type] = newVal[type].value;
            this.errors[type] = '';
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    validateCoin(value, id) {
      const coin = this.coins[id];
      if (value && !this.multicoin[coin].validator.validate(value)) {
        this.errors[coin] = this.$t('ens.ens-resolver.invalid-addr', {
          coin: coin
        });
      } else {
        this.errors[coin] = '';
      }
    },
    submit() {
      /** Creates a no reference clone to be submitted to the contract */
      const copyMulticoin = Object.keys(this.multicoin)
        .map(item => {
          const newItem = Object.assign({}, clone(this.multicoin[item]));
          newItem.value = this.setCoins[item];
          return newItem;
        })
        .filter(item => {
          if (
            item.value &&
            item.value !== '' &&
            item.value !== this.multicoin[item.symbol].value
          )
            return item;
        });
      if (copyMulticoin.length > 0) {
        this.setMulticoin(copyMulticoin);
      } else {
        Toast('No changes were made', {}, WARNING);
      }
    }
  }
};
</script>
