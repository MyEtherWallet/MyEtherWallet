<template functional>
  <div
    class="address-detail-container"
    @click="
      props.selectAccount(props.address ? props.address : props.walletType)
    "
  >
    <div class="check-mark-container">
      <i
        :class="[
          props.selectedAccount === props.address ||
          props.selectedAccount === props.walletType
            ? 'icon-selected'
            : 'icon-not-selected',
          'fa fa-check-circle fa-lg'
        ]"
      />
    </div>
    <div
      :class="[
        props.selectedAccount === props.address ||
        props.selectedAccount === props.walletType
          ? 'selected'
          : '',
        'address-detail'
      ]"
    >
      <component
        :is="injections.components.Blockie"
        v-if="props.walletType === 'wallet'"
        :address="props.address"
        width="30px"
        height="30px"
      />
      <div class="address-text">
        <div v-if="props.walletType === 'wallet'">
          <p v-f="props.nickname !== ''">
            <b>{{ props.nickname }}</b>
          </p>
          <p>{{ props.address | concatAddr }}</p>
          <div class="balance">
            <span>{{ parent.$t('common.balance.string') }}:</span>
            <span>{{ props.balance.substr(0, 7) }} {{ currency }}</span>
          </div>
        </div>
        <div v-else>
          <p>{{ parent.$t('mewcx.use-burner') }}!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
export default {
  inject: {
    components: {
      default: {
        Blockie
      }
    }
  },
  props: {
    nickname: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    balance: {
      type: String,
      default: '0'
    },
    selectedAccount: {
      type: String,
      default: ''
    },
    selectAccount: {
      type: Function,
      default: () => {}
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    walletType: {
      type: String,
      default: 'wallet'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressSelectionComponent.scss';
</style>
