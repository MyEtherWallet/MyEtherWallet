<template>
  <div>
    <div class="balance-wrapper">
      <div class="balance-container mr-3">
        <p class="title">
          {{
            activeDepositTab
              ? $t('dappsAave.aave-depost-bal')
              : $t('dappsAave.you-borrowed')
          }}
        </p>
        <!-- placeholders -->
        <p class="token-balance">
          {{ activeDepositTab ? convertToEther(reserves[indexOfReserve].currentUnderlyingBalance) : borrowedBalance}} <span class="token-name"> {{ reserves[indexOfReserve].name }} </span>
        </p>
        <p class="usd-amt">${{ activeDepositTab ?  getUSDBalance(convertToEther(reserves[indexOfReserve].currentUnderlyingBalance)) : getUSDBalance(borrowedBalance)}}</p>
      </div>
      <div class="balance-container">
        <p class="title">
          {{
            activeDepositTab
              ? $t('dappsAave.aave-wallet-bal')
              : $t('dappsAave.total-collateral')
          }}
        </p>
        <!-- placeholders -->
        <p class="token-balance">
          {{ activeDepositTab ? convertToEther(reserves[indexOfReserve].currentATokenBalance) : collateralBalance}} <span class="token-name">{{ reserves[indexOfReserve].name }}</span>
        </p>
        <p class="usd-amt">${{ activeDepositTab ? getUSDBalance(convertToEther(reserves[indexOfReserve].currentATokenBalance)) : getUSDBalance(collateralBalance)}}</p>
      </div>
    </div>
    <div class="action-container mt-5">
      <p class="action-question">
        {{
          activeDepositTab
            ? $t('dappsAave.how-much-deposit')
            : $t('dappsAave.how-much-borrow')
        }}
      </p>
      <p class="action-info">
        {{
          activeDepositTab
            ? $t('dappsAave.deposit-info')
            : $t('dappsAave.borrow-info')
        }}
      </p>
      <input type="number" />
      <div class="percentage-container">
        <div
          :class="percentBtns.twentyFivePercentEnabled ? 'active' : ''"
          @click="setPercentAmount('twentyFivePercentEnabled')"
        >
          25%
        </div>
        <div
          :class="percentBtns.fiftyPercentEnabled ? 'active' : ''"
          @click="setPercentAmount('fiftyPercentEnabled')"
        >
          50%
        </div>
        <div
          :class="percentBtns.seventyFivePercentEnabled ? 'active' : ''"
          @click="setPercentAmount('seventyFivePercentEnabled')"
        >
          75%
        </div>
        <div
          :class="percentBtns.maxEnabled ? 'active' : ''"
          @click="setPercentAmount('maxEnabled')"
        >
          {{ $t('dappsAave.max') }}
        </div>
      </div>
      <button class="take-action-btn">
        {{
          activeDepositTab
            ? $tc('dappsAave.deposit', 1)
            : $t('dappsAave.borrow')
        }}
      </button>
      <button class="cancel-btn" @click="goToHome()">
        {{
          activeDepositTab
            ? $t('dappsAave.cancel-deposit')
            : $t('dappsAave.cancel-borrow')
        }}
      </button>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { Toast } from '@/helpers';

export default {
  props: {
    activeBorrowTab: {
      type: Boolean,
      default: false
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    },
    reserves: {
      type: Array,
      default: function() {
        return [];
      }
    },
    borrowedBalance: {
      type: String,
      default: ''
    },
    collateralBalance: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ethPrice: '',
      indexOfReserve: this.$route.params.id,
      percentBtns: {
        twentyFivePercentEnabled: true,
        fiftyPercentEnabled: false,
        seventyFivePercentEnabled: false,
        maxEnabled: false
      }
    };
  },
  mounted() {
    this.getEthPrice();
  },
  methods: {
    setPercentAmount(selectedBtn) {
      Object.keys(this.percentBtns).forEach(btn => {
        if (selectedBtn === btn) {
          this.percentBtns[btn] = true;
        } else {
          this.percentBtns[btn] = false;
        }
      });
    },
    goToHome() {
      this.$router.push('/interface/dapps/aave');
    },
    convertToEther(wei) {
      if (!wei) {
        return '0';
      }
      return new BigNumber(unit.fromWei(wei, 'ether')).toFixed(2).toString();
    },
    getUSDBalance(int) {
      let usdBalance = 0;
      if (this.balance) {
        usdBalance = new BigNumber(
          new BigNumber(int).times(new BigNumber(this.ethPrice))
        ).toFixed(2);
      }
      return usdBalance;
    },
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
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionContainer.scss';
</style>
