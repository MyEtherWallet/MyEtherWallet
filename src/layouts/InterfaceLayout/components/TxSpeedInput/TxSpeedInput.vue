<template>
  <div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>Speed of Transaction</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTX')"/>
          </div>
          <!-- <p>Transcation Fee: 0.000013 ETH ($1.234)</p> -->
        </div>
        <div class="buttons">
          <div :class="[$store.state.gasPrice === 5 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(5)">
            Slow
          </div>
          <div :class="[$store.state.gasPrice === 45 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(45)">
            Regular
          </div>
          <div :class="[$store.state.gasPrice === 75 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(75)">
            Fast
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input type="number" name="" :value="$store.state.gasPrice" placeholder="Gas Price" v-on:change="setSpeed" />
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>Nonce</h4>
            <popover :popcontent="$t('popover.whatIsNonce')"/>
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input type="number" v-model="locNonce" placeholder="Nonce" />
        <div class="good-button-container">
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>Gas Limit</h4>
            <popover :popcontent="$t('popover.whatIsGas')"/>
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input type="number" v-model="gasPrice" placeholder="Gas Limit" />
        <div class="good-button-container">
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "TxSpeedInput.scss";
</style>

<script>
export default {
  props: ['data', 'toAddress', 'value', 'gasLimit', 'nonce'],
  data () {
    return {
      fast: 75,
      regular: 45,
      slow: 5,
      gasPrice: this.gasLimit,
      locNonce: this.nonce
    }
  },
  methods: {
    setSpeed (val) {
      if (val.target !== undefined) {
        this.$store.dispatch('setGasPrice', Number(val.target.value))
      } else {
        this.$store.dispatch('setGasPrice', Number(val))
      }
    }
  },
  watch: {
    locNonce (newVal) {
      this.$emit('nonceUpdate', newVal)
    },
    gasPrice (newVal) {
      this.$emit('gasLimitUpdate', newVal)
    }
  }
}
</script>
