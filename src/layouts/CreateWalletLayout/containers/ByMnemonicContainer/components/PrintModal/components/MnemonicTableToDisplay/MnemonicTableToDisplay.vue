<template functional>
  <div class="mnemonic-table-container">
    <div class="header">
      <div class="block-title">
        <img alt src="~@/assets/images/short-hand-logo.png" height="30px" />
        <span>{{ props.title }}</span>
      </div>
      <div class="support">
        <img alt src="~@/assets/images/icons/support.svg" />
        <p>{{ props.supportEmail }}</p>
      </div>
    </div>
    <div class="warnings">
      <h3>
        {{ props.safeText }}
      </h3>
      <p>
        {{ props.weText }}
        <span>{{ props.canNot }}</span> {{ props.changePw }}
        <span>{{ props.dontForget }}</span> {{ props.saveText }}
        <span>{{ props.requirements }}</span> {{ props.accessWallet }}.
      </p>
    </div>
    <div class="content">
      <div v-show="props.isTwentyFour" class="mnemonic full-mnemonic">
        <div v-for="(item, idx) in props.mnemonic" :key="item" class="item">
          <span>{{ idx + 1 }}. </span>{{ item }}
        </div>
      </div>
      <div v-show="!props.isTwentyFour" class="mnemonic half-mnemonic">
        <div
          v-for="(item, idx) in props.mnemonic.slice(0, 12)"
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
    },
    title: {
      type: String,
      default: ''
    },
    supportEmail: {
      type: String,
      default: ''
    },
    safeText: {
      type: String,
      default: ''
    },
    weText: {
      type: String,
      default: ''
    },
    canNot: {
      type: String,
      default: ''
    },
    changePw: {
      type: String,
      default: ''
    },
    dontForget: {
      type: String,
      default: ''
    },
    saveText: {
      type: String,
      default: ''
    },
    requirements: {
      type: String,
      default: ''
    },
    accessWallet: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MnemonicTableToDisplay.scss';
</style>
