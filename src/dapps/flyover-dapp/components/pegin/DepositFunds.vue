<template>
  <div>
    <!-- finalAmount -->
    <div class="field-card">
      <div class="field-label">{{ $t('flyover.pegin.deposit.amount') }}</div>
      <div class="field-value">
        <p class="field-text">{{ String(finalAmount) }}</p>

        <app-copy-btn :copy-value="String(finalAmount)">
          <v-btn x-small icon color="greenPrimary">
            <img
              src="@/assets/images/icons/icon-copy-green.svg"
              alt="copy"
              height="13"
            />
          </v-btn>
        </app-copy-btn>
      </div>
    </div>

    <!-- btcAddress -->
    <div class="field-card">
      <div class="field-label">{{ $t('flyover.pegin.deposit.address') }}</div>
      <div class="field-value">
        <p class="field-text">{{ String(bitcoinDepositAddressHash) }}</p>

        <app-copy-btn :copy-value="String(bitcoinDepositAddressHash)">
          <v-btn x-small icon color="greenPrimary">
            <img
              src="@/assets/images/icons/icon-copy-green.svg"
              alt="copy"
              height="13"
            />
          </v-btn>
        </app-copy-btn>
      </div>
    </div>

    <mew-alert
      hide-close-icon
      class="font-weight-light d-flex justify-space-between align-center mb-7 mt-7"
    >
      {{
        $t('flyover.pegin.deposit.nextStep', {
          amount: finalAmount,
          address: bitcoinDepositAddressHash,
          blocks: confirmations
        })
      }}
    </mew-alert>

    <!-- timer -->
    <div class="timer-container">
      <v-progress-linear
        v-if="tickerActive && !isDone"
        indeterminate
        color="greenPrimary"
      />

      <div v-if="!isDone" class="ticket-subtitle greenPrimary--text">
        {{
          $t('flyover.pegin.deposit.deadline', {
            ticker: ticker
          })
        }}
      </div>

      <div
        v-if="!tickerActive && !isDone"
        class="ticket-subtitle redPrimary--text"
      >
        {{ $t('flyover.pegin.deposit.expired') }}
      </div>
    </div>

    <!-- Done Button -->
    <mew-button
      :disabled="!tickerActive || isDone"
      :has-full-width="true"
      btn-size="xlarge"
      :title="$t('flyover.pegin.deposit.done')"
      @click.native="done"
    />

    <div v-if="isDone">
      <mew-alert
        hide-close-icon
        class="font-weight-light d-flex justify-space-between align-center mb-7 mt-7"
      >
        {{
          $t('flyover.pegin.deposit.doneStep', {
            blocks: confirmations
          })
        }}
      </mew-alert>
    </div>
  </div>
</template>

<script>
import AppCopyBtn from '@/core/components/AppCopyBtn';

export default {
  name: 'DepositFunds',
  components: { AppCopyBtn },
  props: {
    finalAmount: {
      default: 0,
      type: Number
    },
    confirmations: {
      default: 0,
      type: Number
    },
    minimumAge: {
      type: String,
      default: ''
    },
    bitcoinDepositAddressHash: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ticker: '00:00',
      timer: () => {},
      tickerActive: true,
      isDone: false
    };
  },
  mounted() {
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
        }m:${seconds >= 10 ? seconds : seconds < 0 ? '00' : '0' + seconds}s`;
        if (seconds < 0) {
          this.tickerActive = false;
          clearInterval(this.timer);
        }
      }, 1000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    done() {
      this.isDone = true;
      this.tickerActive = false;
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="scss" scoped>
.note {
  margin-top: 15px;
  margin-bottom: 15px;
}
.timer-container {
  .ticket-subtitle {
    line-height: 34px;
    text-align: center;
  }
}
.field-card {
  margin-bottom: 10px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: none;
  padding: 1rem;
  background-color: #f2f4fa;
  border-radius: 10px;
  overflow: auto;
  .field-label {
    color: rgb(144, 136, 154);
  }
  .field-value {
    display: flex;
    justify-content: space-between;
    .field-text {
      color: black;
    }
  }
}
</style>
