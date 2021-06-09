<template>
  <div class="core--components--app-button-balance">
    <v-skeleton-loader v-if="loading" type="text" width="100px" />
    <div v-else class="d-flex align-center justify-end">
      <div class="primary--text mew-body">
        Balance: {{ balanceFormatted.value }}
      </div>
      <mew-tooltip
        v-if="balanceFormatted.tooltipText"
        class="pl-1"
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
.core--components--app-button-balance {
  position: absolute;
  top: -25px;
  right: 0px;
}
</style>
