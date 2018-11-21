<template>
  <div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTX')" />
          </div>
        </div>
        <div class="buttons">
          <div
            :class="[
              gasPrice === locHighestGas / 4 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas / 4);"
          >
            {{ $t('common.slow') }}
          </div>
          <div
            :class="[
              gasPrice === locHighestGas / 2 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas / 2);"
          >
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[
              gasPrice === locHighestGas ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas);"
          >
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input
          :value="gasPrice"
          :placeholder="$t('common.gasPrice')"
          type="number"
          name=""
          @change="setSpeed"
        />
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>Nonce</h4>
            <popover :popcontent="$t('popover.nonce')" />
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input v-model="locNonce" type="number" placeholder="Nonce" />
        <div class="good-button-container">
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t('common.gasLimit') }}</h4>
            <popover :popcontent="$t('popover.gasLimit')" />
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input
          v-model="locGasLimit"
          :placeholder="$t('common.gasLimit')"
          type="number"
        />
        <div class="good-button-container">
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    data: {
      type: String,
      default: ''
    },
    toAddress: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: '0'
    },
    gasLimit: {
      type: Number,
      default: 21000
    },
    nonce: {
      type: Number,
      default: 0
    },
    highestGas: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      locNonce: this.nonce,
      locGasLimit: this.gasLimit,
      locHighestGas: this.highestGas
    };
  },
  computed: {
    ...mapGetters({
      gasPrice: 'gasPrice'
    })
  },
  watch: {
    locNonce(newVal) {
      this.$emit('nonceUpdate', Number(newVal));
    },
    locGasLimit(newVal) {
      this.$emit('gasLimitUpdate', Number(newVal));
    }
  },
  mounted() {
    this.highestGas === 0
      ? (this.locHighestGas = 10)
      : (this.locHighestGas = this.highestGas);
  },
  methods: {
    setSpeed(val) {
      if (val.target !== undefined) {
        this.$store.dispatch('setGasPrice', Number(val.target.value));
      } else {
        this.$store.dispatch('setGasPrice', Number(val));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TxSpeedInput.scss';
</style>
