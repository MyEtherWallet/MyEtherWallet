<template>
  <div class="mnemonic-table-container">
    <div class="header">
      <div class="block-title">
        <img src="~@/assets/images/short-hand-logo.png" height="30px" />
        <span>Mnemonic Phrase</span>
      </div>
      <div class="support">
        <img src="~@/assets/images/icons/support.svg" />
        <p>support@myetherwallet.com</p>
      </div>
    </div>
    <div class="warnings">
      <h3>
        Please Keep This Sheet at a Very Safe Place. It is your property!
      </h3>
      <p>
        We <span>CAN NOT</span> change your password. Please
        <span>DO NOT FORGET</span> to save your password, and it is your private
        key. You will need this <span>Password + Mnemonic Phrase</span> to
        access your wallet.
      </p>
    </div>
    <div class="content">
      <div v-show="isTwentyFour" class="mnemonic full-mnemonic">
        <div v-for="(item, idx) in mnemonic" :key="item" class="item">
          <span>{{ idx + 1 }}. </span>{{ item }}
        </div>
      </div>
      <div v-show="!isTwentyFour" class="mnemonic half-mnemonic">
        <div
          v-for="(item, idx) in mnemonic.slice(0, 12)"
          :key="item"
          class="item"
        >
          <span>{{ idx + 1 }}. </span>{{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    mnemonic: {
      type: Array,
      default: () => []
    },
    isTwentyFour: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MnemonicTableToDisplay.scss';
</style>
