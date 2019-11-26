<template>
  <div>
    <div class="balance-row">
      <balance-display :title="$t('dappsAave.aggregated-balance')" />
      <balance-display :title="$t('dappsAave.earnings')" class="ml-3" />
    </div>
  </div>
</template>

<script>
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';

export default {
  'balance-display': BalanceDisplay
};
</script>
