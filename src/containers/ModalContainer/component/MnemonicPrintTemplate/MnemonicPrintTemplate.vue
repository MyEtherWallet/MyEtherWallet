<template>
  <div>
    <div class="print-container">
      <div class="content">
        <div class="header">
          <img src="~@/assets/images/logo.png" height="30px" />
          <div></div>
          <span>Mnemonic Phrase</span>
        </div>
        <div v-show="isTwentyFour" class="full-mnemonic">
          <div>
            <div
              v-for="(item, idx) in mnemonic.slice(0, 12)"
              :key="item"
              class="item"
            >
              <span>{{ idx + 1 }}. </span>{{ item }}
            </div>
          </div>
          <div>
            <div
              v-for="(item, idx) in mnemonic.slice(12, 24)"
              :key="item"
              class="item"
            >
              <span>{{ idx + 13 }}.</span> {{ item }}
            </div>
          </div>
        </div>
        <div v-show="!isTwentyFour" class="half-mnemonic">
          <div
            v-for="(item, idx) in mnemonic.slice(0, 12)"
            :key="item"
            class="item"
          >
            <span>{{ idx + 1 }}. </span>{{ item }}
          </div>
        </div>
      </div>
      <div class="footer">
        <div>
          <img src="~@/assets/images/icons/support.svg" />
          support@myetherwallet.com
        </div>
        <div>
          <img src="~@/assets/images/icons/web-solution.svg" />
          https://www.myetherwallet.com
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
      default: () => {
        return [];
      }
    }
  },
  computed: {
    isTwentyFour() {
      return this.mnemonic.length > 12;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicPrintTemplate.scss';
</style>
