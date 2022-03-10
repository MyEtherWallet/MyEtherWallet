<template>
  <div class="core--components--app-button-balance">
    <v-skeleton-loader v-if="loading" type="text" width="100px" />
    <div v-else class="d-flex align-center justify-end">
      <div class="greenPrimary--text mew-body">
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
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    /** Set this proerty to wei if you are dispalying ETH balance vs erc20 tokens*/
    balance: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    balanceFormatted() {
      return formatFloatingPointValue(this.balance);
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
