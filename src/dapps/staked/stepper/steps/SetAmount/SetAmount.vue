<template>
  <!--  <div class="amount-step d-flex">
    <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
    <i18n class="subtitle" path="dappsStaked.validator-required-eth-per">
      <span slot="number">1</span>
    </i18n>
    <div class="action-container">
      <div class="input-container">
        <img
          :alt="$t('common.currency.ethereum')"
          class="currency-icon"
          src="@/assets/images/currencies/eth.png"
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
  </div>-->
  <div>
    <v-row class="mx-0 bottom-pad">
      <v-col class="pr-0" cols="12">
        <mew-input
          :error-messages="getErrorMessage"
          :value="amount"
          :has-clear-btn="true"
          :rules="rules"
          :label="$t('ens.register.domain-name')"
          :placeholder="$t('ens.ph.three-char')"
          class="mr-3 flex-grow-1"
          @input="setAmount"
        />
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
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-col class="pl-4" cols="8">
        <mew-button
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('ens.register-domain')"
          @click.native="doNext"
        />
      </v-col>
    </v-row>
    <!--    <v-row class="mx-0">-->
    <!--      <v-col class="pr-0" cols="8"> status </v-col>-->
    <!--      <v-col class="pl-0" cols="4"> status </v-col>-->
    <!--    </v-row>-->
  </div>
</template>

<script>
import { toBN, toWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { mapState, mapGetters } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const types = ['32', '64', '96', '128'];

export default {
  props: {
    next: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      amount: '0',
      ethPrice: '',
      balance: 0,
      balanceInETH: '72'
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    // ...mapGetters('wallet', ['balanceInETH']),
    hasError() {
      return this.notValidMultiple || this.notEnoughBalance;
    },
    notValidMultiple() {
      return this.amount && (this.amount <= 0 || this.amount % 32 !== 0);
    },
    notEnoughBalance() {
      return (
        this.amount &&
        toBN(toWei(this.amount.toString(), 'ether')).gt(
          toWei(this.balance.toString(), 'ether')
        )
      );
    },
    usdPrice() {
      if (this.ethPrice) {
        return new BigNumber(this.ethPrice).times(this.amount);
      }
      return 0;
    },
    amountAsString() {
      return this.amount.toString();
    },
    rules() {
      return [
        (this.name && this.name.length > 2) ||
          this.$t('ens.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol')
      ];
    },
    getErrorMessage() {
      // if(this.notValidMultiple){
      //   return this.$t('dappsStaked.error-set-amount')
      // } else if(this.hasError && this.notEnoughBalance){
      //   return this.$t('dappsStaked.error-not-enough-bal')
      // }
      return null;
    }
  },
  watch: {
    balanceInETH: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.balance = val;
      }
    }
  },
  mounted() {
    this.balance = this.balanceInETH;
    console.log(toWei(this.balance.toString(), 'ether')); // todo remove dev item
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
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast(e, ERROR);
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
        console.log(this.amount); // todo remove dev item
      }
      this.$emit(
        'completed',
        /*!this.hasError,*/ true,
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
//@import 'SetAmount.scss';
.percentage-container {
  align-items: center;
  display: flex;

  div {
    color: gray;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 8px;
    width: 100%;
  }

  .active {
    border-radius: 4px;
    border: 1px solid green;
    color: green;
  }
}

.bottom-pad {
  padding-bottom: 40px;
}
</style>
