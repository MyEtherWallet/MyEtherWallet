<template functional>
  <div class="mnemonic-table-container">
    <div class="header">
      <div class="block-title">
        <img
          :src="
            require(`@/assets/images/short-hand-logo-${
              buildType ? buildType : 'web'
            }.png`)
          "
          height="30px"
          alt
        />
        <span>{{ parent.$t('createWallet.mnemonic.table.title') }}</span>
      </div>
      <div class="support">
        <img alt src="~@/assets/images/icons/support.svg" />
        <p>{{ parent.$t('common.support-email') }}</p>
      </div>
    </div>
    <div class="warnings">
      <h3>
        {{ parent.$t('createWallet.mnemonic.table.safe-place') }}
      </h3>
      <i18n tag="p" path="createWallet.mnemonic.table.cannot-change-pw">
        <span slot="cannot">{{
          parent.$t('createWallet.mnemonic.table.cannot')
        }}</span>
        <span slot="do-not-forget"
          >{{ parent.$t('createWallet.mnemonic.table.do-not-forget') }}
        </span>
        <span slot="requirements">{{
          parent.$t('createWallet.mnemonic.table.requirements')
        }}</span>
      </i18n>
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
    buildType: {
      type: String,
      default: 'web'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MnemonicTableToPrint.scss';
</style>
