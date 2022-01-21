<template>
  <!-- ======================================================================================= -->
  <!-- Side APR -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr backgroundGrey pa-5 border-radius--10px"
  >
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Current APR
      </div>
      <div class="textLight--text">{{ validatorApr }}%</div>
    </div>
    <div class="d-flex align-center justify-space-between">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        ETH in pool
      </div>
      <div>{{ formattedPoolValue }} {{ networkName }}</div>
    </div>
  </div>
</template>

<script>
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'StakewiseApr',
  computed: {
    ...mapState('stakewise', ['validatorApr']),
    ...mapGetters('global', ['network']),
    ...mapGetters('stakewise', ['getPoolSupply']),
    networkName() {
      return this.network.type.currencyName;
    },
    formattedPoolValue() {
      return formatFloatingPointValue(this.getPoolSupply).value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
