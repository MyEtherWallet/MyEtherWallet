<template>
  <div>
    <div class="d-flex flex-column bgWalletBlockDark pa-6 rounded">
      <div class="d-flex justify-space-between">
        <span>{{ t('ens.register.domain-name') }}:</span>
        <span class="font-weight-medium">{{ name }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span>{{ t('ens.register.term') }}:</span>
        <span class="font-weight-medium">{{
          duration === 1
            ? tc('ens.commit.year', 1)
            : tc('ens.commit.year', 2, { duration: duration })
        }}</span>
      </div>
      <div
        v-if="!committed && !loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Estimated Fee:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} ETH ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="!committed && loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Commitment Cost:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} ETH ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="committed && !loadingCommit && !waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Commitment Cost:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} ETH ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="!committed && loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span class="font-weight-medium">
          Generating registration cost. Please wait...
        </span>
      </div>

      <div
        v-if="
          !committed && !loadingCommit && !waitingForReg && !noFundsForRegFees
        "
        class="d-flex justify-space-between"
      >
        <span>Registration Cost:</span>
        <span class="font-weight-medium">
          {{ totalCost }} ETH ({{ totalCostUsd }})
        </span>
      </div>

      <div
        v-if="
          !committed && !loadingCommit && !waitingForReg && noFundsForRegFees
        "
        class="d-flex justify-space-between"
      >
        <span>Registration Cost:</span>
        <span class="font-weight-medium">
          Not enough funds to complete registration
        </span>
      </div>
    </div>
    <div
      v-if="minimumAge || canRegister"
      class="timer-container d-flex flex-column align-center justify-center mt-4"
    >
      <mew-icon
        class="canRegister ? 'disabled' : ''"
        icon-name="clock"
        :img-height="80"
      />
      <span class="ticket-subtitle greenPrimary--text">{{ ticker }}</span>
      <div
        v-if="!canRegister"
        class="d-flex flex-column mt-5 justify-center align-center"
      >
        <span class="mew-heading-2">{{ t('ens.hang-on') }}</span>
        <span class="mt-3 desc-container">{{
          t('ens.hang-on-committing')
        }}</span>
      </div>
      <div
        v-if="canRegister"
        class="d-flex flex-column mt-5 justify-center align-center"
      >
        <span class="mew-heading-2">{{ t('ens.register.complete-reg') }}</span>
        <span class="mt-3 desc-container">{{
          t('ens.register.complete-reg-desc')
        }}</span>
      </div>
    </div>
    <div v-if="notEnoughFunds || noFundsForRegFees">
      <span class="balance-error d-flex mt-5 justify-center align-center">
        Not enough balance:
        <a
          v-show="network.type.canBuy"
          target="_blank"
          class="link"
          @click="
            () => {
              openBuySell('ENSRegister');
            }
          "
        >
          <u>Buy More Eth</u>
        </a>
      </span>
    </div>
    <div class="d-flex justify-center mt-6">
      <mew-button
        :disabled="
          loadingCommit ||
          ticker !== '00:00' ||
          notEnoughFunds ||
          noFundsForRegFees ||
          loadingReg
        "
        :loading="loadingReg"
        :title="
          canRegister
            ? t('ens.register.name')
            : t('ens.register.create-commitment')
        "
        btn-size="xlarge"
        @click.native="!canRegister ? commit() : register(duration)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useGlobalStore } from '@/core/store/global';

import { useBuySell } from '@/core/composables/buyMore';
import { useI18n } from 'vue-i18n-composable';

// injections
const { openBuySell } = useBuySell();
const { t, tc } = useI18n();
const { network } = useGlobalStore();

// props
const props = defineProps({
  notEnoughFunds: {
    default: false,
    type: Boolean
  },
  noFundsForRegFees: {
    default: false,
    type: Boolean
  },
  commitFeeInEth: {
    type: String,
    default: ''
  },
  commitFeeUsd: {
    type: String,
    default: ''
  },
  totalCost: {
    type: String,
    default: ''
  },
  totalCostUsd: {
    type: String,
    default: ''
  },
  waitingForReg: {
    default: false,
    type: Boolean
  },
  loadingCommit: {
    default: false,
    type: Boolean
  },
  loadingReg: {
    default: false,
    type: Boolean
  },
  committed: {
    default: false,
    type: Boolean
  },
  name: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 1
  },
  minimumAge: {
    type: String,
    default: ''
  },
  register: {
    default: function () {
      return {};
    },
    type: Function
  },
  commit: {
    default: function () {
      return {};
    },
    type: Function
  }
});

// data
const ticker = ref('00:00');
const timer = ref(() => {});
const canRegister = ref(false);

// watch
watch(
  () => props.minimumAge,
  newVal => {
    ticker.value = `0${newVal / 60 < 10 ? Math.ceil(newVal / 60) : '00'}:00`;
  }
);
watch(
  () => props.loadingCommit,
  newVal => {
    if (newVal) {
      clearInterval(timer);
      const startTime = new Date().getTime();
      const endTime = startTime + props.minimumAge * 1000;
      if (props.minimumAge > 0) {
        timer.value = setInterval(() => {
          const startInterval = new Date().getTime();
          const difference = endTime - startInterval;
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          ticker.value = `${
            minutes >= 10 ? minutes : minutes < 0 ? '00' : '0' + minutes
          }:${seconds >= 10 ? seconds : seconds < 0 ? '00' : '0' + seconds}`;
          if (seconds < 0) {
            clearInterval(timer);
          }
        }, 1000);
      }
    } else if (!newVal) {
      clearInterval(timer);
      canRegister.value = true;
      ticker.value = '00:00';
    } else {
      clearInterval(timer);
    }
  }
);
// destroyed
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.timer-container {
  .disabled {
    filter: grayscale(100%);
  }
  .desc-container {
    max-width: 300px;
  }
  .ticket-subtitle {
    line-height: 34px;
  }
}
.balance-error {
  color: #ff445b;
  font-size: 12px;
}
.link {
  color: #ff445b;
  font-weight: 600;
  padding-left: 5px;
  font-size: 12px;
}
.link:hover {
  color: #e96071;
}
</style>
