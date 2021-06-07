<template>
  <div class="mew-component--top-right-text">
    <v-skeleton-loader v-if="loading" type="text" width="100px" />
    <div v-else class="d-flex">
      <div class="primary--text mew-body">
        Balance: {{ balanceFormatted.value }}
      </div>
      <mew-tooltip
        class="pl-1"
        v-if="balanceFormatted.tooltipText"
        :text="balanceFormatted.tooltipText"
      />
    </div>
  </div>
</template>

<script>
import {
  formatBalanceEthValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    balance: {
      type: String,
      default: ''
    },
    isEth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {
    balanceFormatted() {
      return this.isEth
        ? formatBalanceEthValue(this.balance)
        : formatFloatingPointValue(this.balance);
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--top-right-text {
  position: absolute;
  top: -23px;
  right: 0px;
}
</style>
