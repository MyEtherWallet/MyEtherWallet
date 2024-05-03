<template>
  <div class="full-width">
    <mew-select
      :has-filter="true"
      :label="t('ens.request.select-duration')"
      :items="items"
      normal-dropdown
      @input="setDuration"
    />
    <div class="font-weight-bold text-center">
      {{ t('ens.request.estimated-price') }}: {{ rentPriceETH }}
      {{ t('common.currency.eth') }} ({{ rentPriceUSD }})
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <div>
        <span
          v-if="noFundsForRenewalFees"
          class="balance-error d-flex mt-2 mb-3 justify-center align-center"
        >
          Not enough balance.
          <a
            v-show="network.type.canBuy"
            target="_blank"
            class="link"
            @click="
              () => {
                openBuySell('ENSRenew');
              }
            "
          >
            <u>Buy More Eth</u>
          </a>
        </span>
        <div class="d-flex align-center justify-center">
          <mew-button
            :loading="loadingRenew"
            :disabled="noFundsForRenewalFees || loadingRenew"
            :title="t('ens.renew')"
            btn-size="xlarge"
            @click.native="renew(duration)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted } from 'vue';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { useBuySell } from '@/core/composables/buyMore';
import { useGlobalStore } from '@/core/store/global';

import { useI18n } from 'vue-i18n-composable';

// injections/use
const { openBuySell } = useBuySell();
const { getFiatValue, network } = useGlobalStore();
const { t } = useI18n();

// props
const props = defineProps({
  getRentPrice: {
    default: function () {
      return {};
    },
    type: Function
  },
  renew: {
    default: function () {
      return {};
    },
    type: Function
  },
  noFundsForRenewalFees: {
    default: false,
    type: Boolean
  },
  loadingRenew: {
    default: false,
    type: Boolean
  }
});

// data
const duration = ref(0);
const rentPriceETH = ref('');
const rentPriceUSD = ref('');

// computed
const items = computed(() => {
  const items = [];
  for (let i = 0; i < 20; i++) {
    items.push({
      name: i + 1 + ' ' + `year${i < 1 ? '' : 's'}`,
      value: (i + 1).toString()
    });
  }
  return items;
});

// watch
watch(duration, newVal => {
  props.getRentPricegetTotalRenewFeeOnly(newVal);
});

// mounted
onMounted(() => {
  rentPrice();
  props.getRentPricegetTotalRenewFeeOnly(1);
});

// methods
const rentPrice = () => {
  return props.getRentPrice(duration).then(resp => {
    if (resp) {
      rentPriceETH.value = formatFloatingPointValue(resp.eth).value;
      rentPriceUSD.value = getFiatValue()(resp.usd);
    }
  });
};
const setDuration = item => {
  duration.value = parseInt(item.value);
  rentPrice();
};
</script>
<style lang="scss" scoped>
.balance-error {
  color: #ff445b;
  font-size: 12px;
}
.link {
  color: #ff445b;
  font-weight: 600;
  padding-left: 5px;
  font-size: 12px;
}
.link:hover {
  color: #e96071;
}
</style>
