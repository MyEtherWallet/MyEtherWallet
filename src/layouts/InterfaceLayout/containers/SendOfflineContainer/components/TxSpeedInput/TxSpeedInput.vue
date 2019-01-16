<template>
  <div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.txSpeed')" />
          </div>
        </div>
        <div class="buttons">
          <div
            :class="[
              gasPrice === locHighestGas / 2 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas / 2)"
          >
            {{ $t('common.economy') }}
          </div>
          <div
            :class="[
              gasPrice === locHighestGas ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas)"
          >
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[
              gasPrice === locHighestGas * 1.25 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="setSpeed(locHighestGas * 1.25)"
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
          name
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    nonce: {
      type: Number,
      default: 0
    },
    highestGas: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      locNonce: this.nonce,
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
    nonce(newVal) {
      this.locNonce = newVal;
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
