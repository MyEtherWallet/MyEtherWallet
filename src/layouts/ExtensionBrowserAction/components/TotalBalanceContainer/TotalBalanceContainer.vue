<template>
  <div class="total-balance-container">
    <div class="title-name">
      {{ $t('common.balance.total') }}
    </div>
    <div class="balance-container">
      <p class="actual-balance">
        {{ totalBalance }} <span>{{ network.type.name }} </span>
      </p>
      <p v-if="network.type.name === 'ETH'" class="converted-balance">
        {{ convertedBalance }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    network: {
      type: Object,
      default: () => {
        return {};
      }
    },
    totalBalance: {
      type: String,
      default: '0'
    },
    convertedBalance: {
      type: String,
      default: '$ 0'
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'TotalBalanceContainer.scss';
</style>
