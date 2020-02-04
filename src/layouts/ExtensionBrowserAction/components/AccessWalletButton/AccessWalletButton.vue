<template>
  <div class="wallet-buttons-container">
    <div
      v-for="item in info"
      :key="item.title"
      class="wallet-button-option"
      @click="item.func"
    >
      <div class="button-option-title">
        <p>{{ item.title }}</p>
        <div v-if="item.recommended" class="recommended">
          <img src="@/assets/images/icons/shield.png" />
          <span>{{ item.recommendedText }}</span>
        </div>
        <div v-else class="subtext">
          <span>{{ item.subtext }}</span>
        </div>
      </div>
      <div class="img-container">
        <img :src="item.img" />
      </div>
    </div>
  </div>
</template>

<script>
import generate from '@/assets/images/icons/button-generate-hover.svg';
import importImg from '@/assets/images/icons/button-software-no-padding.svg';
export default {
  props: {
    generate: {
      type: Function,
      default: () => {}
    },
    import: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      info: [
        {
          title: 'Generate a New Wallet',
          subtext: '',
          recommended: true,
          recommendedText: 'Recommended',
          func: () => this.generate(1),
          img: generate
        },
        {
          title: 'Import an Existing Wallet',
          subtext: 'Keystore file / Mnemonic phrase / Private key',
          recommended: false,
          recommendedText: '',
          func: () => this.import(2),
          img: importImg
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessWalletButton.scss';
</style>
