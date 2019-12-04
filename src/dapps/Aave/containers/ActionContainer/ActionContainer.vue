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
          59.34234 <span class="token-name"> {{ reserves[indexOfReserve].name }} </span>
        </p>
        <p class="usd-amt">$60.12</p>
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
          28.123 <span class="token-name">{{ $t('dappsAave.dai') }}</span>
        </p>
        <p class="usd-amt">$29.52</p>
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
    }
  },
  data() {
    return {
      indexOfReserve: this.$route.params.id,
      percentBtns: {
        twentyFivePercentEnabled: true,
        fiftyPercentEnabled: false,
        seventyFivePercentEnabled: false,
        maxEnabled: false
      }
    };
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionContainer.scss';
</style>
