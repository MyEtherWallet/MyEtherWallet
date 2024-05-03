<template>
  <div>
    <div v-if="loading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="greenPrimary" />
    </div>
    <div
      v-if="!loading"
      class="d-flex align-center pa-6 bgWalletBlockDark rounded"
    >
      <v-icon size="80" color="greenPrimary" class="mr-3">
        mdi-check-circle-outline
      </v-icon>
      <div>
        <div class="mew-heading-2 mb-2 greenPrimary--text">
          {{ t('ens.is-available') }}
        </div>
        <div class="mew-heading-2">{{ name }}</div>
      </div>
    </div>
    <div class="pa-1 mt-3 mb-7 text-center">
      {{ t('ens.request.about-domain') }}
    </div>
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
    <div class="d-flex justify-center mt-6">
      <mew-button
        :title="t('common.next')"
        btn-size="xlarge"
        @click.native="onClick"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, defineEmits, onMounted } from 'vue';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { useI18n } from 'vue-i18n-composable';

// emits
const emit = defineEmits(['onRequest']);

// injections/use
const { getFiatValue } = useGlobalStore();
const { t } = useI18n();

// props
const props = defineProps({
  getRentPrice: {
    default: function () {
      return {};
    },
    type: Function
  },
  loading: {
    default: false,
    type: Boolean
  },
  name: {
    default: '',
    type: String
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

// mounted
onMounted(() => {
  rentPrice();
});
// methods
const rentPrice = () => {
  if (duration.value > 0) {
    return props.getRentPrice(duration).then(resp => {
      if (resp) {
        rentPriceETH.value = formatFloatingPointValue(resp.eth).value;
        rentPriceUSD.value = getFiatValue()(resp.usd);
      }
    });
  }
};
const onClick = () => {
  emit('onRequest', duration);
};
const setDuration = item => {
  duration.value = parseInt(item.value);
  rentPrice();
};
</script>
