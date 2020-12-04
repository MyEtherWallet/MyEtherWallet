<template>
  <div class="amount-step d-flex">
    <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
    <i18n class="subtitle" path="dappsStaked.validator-required-eth-per">
      <span slot="number">1</span>
    </i18n>
    <div class="action-container">
      <div class="input-container">
        <img
          :alt="$t('common.currency.ethereum')"
          class="currency-icon"
          src="@/assets/images/currency/eth.svg"
        />
        <input
          v-model="amount"
          type="number"
          placeholder="0"
          @keyup="setAmount"
          @change="setAmount"
        />
        <span class="usd-amount">{{ '$' + usdPrice }}</span>
      </div>
      <div v-if="notValidMultiple" class="error mt-2">
        {{ $t('dappsStaked.error-set-amount') }}
      </div>
      <div v-if="hasError && notEnoughBalance" class="error mt-2">
        {{ $t('dappsStaked.error-not-enough-bal') }}
      </div>
      <div class="percentage-container pt-2">
        <div :class="isActive(0) ? 'active' : ''" @click="setAmount(0)">
          32 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(1) ? 'active' : ''" @click="setAmount(1)">
          64 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(2) ? 'active' : ''" @click="setAmount(2)">
          96 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(3) ? 'active' : ''" @click="setAmount(3)">
          128 {{ $t('common.currency.eth') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import { toBN, toWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

const types = [32, 64, 96, 128];

export default {
  data() {
    return {
      amount: 0,
      ethPrice: '',
      balance: 0
    };
  },
  computed: {
    ...mapState('main', ['account', 'web3']),
    hasError() {
      return this.notValidMultiple || this.notEnoughBalance;
    },
    notValidMultiple() {
      return this.amount && (this.amount <= 0 || this.amount % 32 !== 0);
    },
    notEnoughBalance() {
      return (
        this.amount &&
        toBN(toWei(this.amount.toString(), 'ether')).gt(toBN(this.balance))
      );
    },
    usdPrice() {
      if (this.ethPrice) {
        return new BigNumber(this.ethPrice).times(this.amount);
      }
      return 0;
    }
  },
  watch: {
    'account.balance': {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.balance = val;
      }
    }
  },
  mounted() {
    this.balance = this.account.balance;
    this.getEthPrice();
    this.$watch(
      () => {
        // returns the value to callback when this changes
        return (
          !this.hasError &&
          toBN(toWei(this.balance.toString(), 'ether')).gt(
            toWei('32', 'ether')
          ) &&
          this.amount !== 0
        );
      },
      val => {
        if (val) {
          this.setAmount(this.amount);
        }
      },
      { immediate: true }
    );
  },
  methods: {
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });

      this.ethPrice = price && price.data ? price.data.ETH.quotes.USD.price : 0;
    },
    isActive(idx) {
      if (this.amount === types[idx]) {
        return true;
      }
      return false;
    },
    setAmount(idx) {
      if (Number.isInteger(idx) && idx < 4) {
        this.amount = types[idx];
      }
      this.$emit(
        'completed',
        !this.hasError,
        {
          key: 'amount',
          value: this.amount
        },
        this.ethPrice
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SetAmount.scss';
</style>
