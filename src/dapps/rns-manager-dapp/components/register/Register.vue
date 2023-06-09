<template>
  <div>
    <div class="d-flex flex-column greyLight pa-6 rounded">
      <div class="d-flex justify-space-between">
        <span>{{ $t('rns.register.domain-name') }}:</span>
        <span class="font-weight-medium">{{ name }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span>{{ $t('rns.register.term') }}:</span>
        <span class="font-weight-medium">{{
          duration === 1
            ? $tc('rns.commit.year', 1)
            : $tc('rns.commit.year', 2, { duration: duration })
        }}</span>
      </div>
      <div
        v-if="!committed && !loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Estimated Fee:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} RIF ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="!committed && loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Commitment Cost:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} RIF ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="committed && loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span>Commitment Cost:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} RIF ({{ commitFeeUsd }})
        </span>
      </div>

      <div
        v-if="!committed && loadingCommit && waitingForReg"
        class="d-flex justify-space-between"
      >
        <span class="font-weight-medium"> Please wait... </span>
      </div>

      <div
        v-if="committed && waitingForReg && !noFundsForRegFees"
        class="d-flex justify-space-between"
      >
        <span>Cost:</span>
        <span class="font-weight-medium">
          {{ commitFeeInEth }} RIF ({{ commitFeeUsd }})
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
        <span class="mew-heading-2">{{ $t('rns.hang-on') }}</span>
        <span class="mt-3 desc-container">{{
          $t('rns.hang-on-committing')
        }}</span>
      </div>
      <div
        v-if="canRegister"
        class="d-flex flex-column mt-5 justify-center align-center"
      >
        <span class="mew-heading-2">{{ $t('rns.register.complete-reg') }}</span>
        <span class="mt-3 desc-container">{{
          $t('rns.register.complete-reg-desc')
        }}</span>
      </div>
    </div>
    <div v-if="notEnoughFunds || noFundsForRegFees">
      <span class="balance-error d-flex mt-5 justify-center align-center">
        Not enough balance:
        <a target="_blank" class="link" href="https://faucet.rifos.org/">
          <u>Buy More RIF tokens</u>
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
            ? $t('rns.register.name')
            : $t('rns.register.create-commitment')
        "
        btn-size="xlarge"
        @click.native="!canRegister ? commit(duration) : register(duration)"
      />
    </div>
  </div>
</template>

<script>
import buyMore from '@/core/mixins/buyMore.mixin.js';
export default {
  name: 'RnsRegister',
  mixins: [buyMore],
  props: {
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
  },
  data() {
    return {
      ticker: '00:00',
      timer: () => {},
      canRegister: false
    };
  },
  watch: {
    minimumAge(newVal) {
      this.ticker = `0${newVal / 60 < 10 ? Math.ceil(newVal / 60) : '00'}:00`;
    },
    loadingCommit(newVal) {
      if (newVal) {
        clearInterval(this.timer);
        const startTime = new Date().getTime();
        const endTime = startTime + this.minimumAge * 1000;
        if (this.minimumAge > 0) {
          this.timer = setInterval(() => {
            const startInterval = new Date().getTime();
            const difference = endTime - startInterval;
            const minutes = Math.floor(
              (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            this.ticker = `${
              minutes >= 10 ? minutes : minutes < 0 ? '00' : '0' + minutes
            }:${seconds >= 10 ? seconds : seconds < 0 ? '00' : '0' + seconds}`;
            if (seconds < 0) {
              clearInterval(this.timer);
            }
          }, 1000);
        }
      } else if (!newVal) {
        clearInterval(this.timer);
        this.canRegister = true;
        this.ticker = '00:00';
      } else {
        clearInterval(this.timer);
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
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
