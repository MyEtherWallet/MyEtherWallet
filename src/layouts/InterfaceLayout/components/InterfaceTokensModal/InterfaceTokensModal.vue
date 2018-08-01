<template lang="html">
  <div>
    <b-modal ref="token" hide-footer class="bootstrap-modal nopadding max-height-1" centered title="Add Custom Token" v-on:hidden="resetCompState">
      <form class="tokens-modal-body">
        <div>
          <input type="text" v-model="tokenAddress" placeholder="Token Contract Address" class="custom-input-text-1"/>
          <input type="text" v-model="tokenSymbol" placeholder="Token Symbol" class="custom-input-text-1"/>
          <input type="number" v-model="tokenDecimal" min="0" max="18" placeholder="Decimals" class="custom-input-text-1"/>
        </div>
        <div>
          <button type="submit" @click.prevent="addToken(tokenAddress, tokenSymbol, tokenDecimal)" :class="[validAddress && tokenSymbol !== '' && tokenDecimal !== '' ? '': 'disabled','save-button large-round-button-green-filled clickable']">
            {{ $t('interface.save') }}
          </button>
          <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.dontKnow')"></interface-bottom-text>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'

export default {
  props: ['addToken'],
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  data () {
    return {
      tokenAddress: '',
      tokenSymbol: '',
      tokenDecimal: '',
      validAddress: false
    }
  },
  methods: {
    resetCompState () {
      this.tokenAddress = ''
      this.tokenSymbol = ''
      this.tokenDecimal = ''
      this.validAddress = false
    }
  },
  watch: {
    tokenAddress (newVal) {
      if (newVal !== '' && newVal.length !== 0 && this.$store.state.web3.utils.isAddress(newVal)) {
        this.validAddress = true
      } else {
        this.validAddress = false
      }
      this.toAddress = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
@import "InterfaceTokensModal.scss";
</style>
