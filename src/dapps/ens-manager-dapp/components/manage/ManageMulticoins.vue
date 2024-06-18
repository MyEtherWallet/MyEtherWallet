<template>
  <div class="full-width">
    <div v-for="(coin, idx) in coins" :key="coin + idx">
      <mew-input
        :id="idx"
        v-model="setCoins[coin]"
        :label="coin"
        class="mb-2"
        :placeholder="coin + ' ' + $t('common.addr')"
        :error-messages="errors[coin]"
        @input="validateCoin"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="!valid"
        @click.native="submit"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { clone } from 'lodash';
import { useI18n } from 'vue-i18n-composable';

import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';

// injections
const { t } = useI18n();

// props
const props = defineProps({
  setMulticoin: {
    default: () => {},
    type: Function
  },
  multicoin: {
    type: [Object, null],
    default: null
  }
});

// data
const locErrors = ref({});
const locCoin = ref({});

for (const type in props.multicoin) {
  locErrors.value[type] = '';
  // eslint-disable-next-line
  locCoin.value[type] = props.multicoin[type];
}

const setCoins = ref(locCoin.value);
const errors = ref(locErrors.value);

// computed
const coins = computed(() => {
  return Object.keys(setCoins.value);
});

const hasError = computed(() => {
  return (
    Object.values(errors.value).filter(item => {
      if (item !== '') return item;
    }).length > 0
  );
});

const valid = computed(() => {
  const hasValues = Object.values(setCoins.value).filter(item => {
    if (item && item.value !== '') return item;
  });

  return hasValues.length > 0 && !hasError.value;
});

// watch
watch(
  () => setCoins.value,
  () => {
    errors.value = Object.keys(setCoins.value).reduce((acc, item) => {
      acc[item] = '';
      return acc;
    }, {});
  },
  { deep: true, immediate: true }
);

// methods
const validateCoin = (value, id) => {
  const coin = coins.value[id];
  if (value && !props.multicoin.value[coin].validator.validate(value)) {
    errors.value[coin] = t('ens.ens-resolver.invalid-addr', {
      coin: coin
    });
  } else {
    errors.value[coin] = '';
  }
};

const submit = () => {
  const copyMulticoin = Object.keys(props.multicoin).reduce((acc, item) => {
    const newItem = Object.assign({}, clone(props.multicoin[item]));
    newItem.value = setCoins.value[item];

    if (
      newItem.value &&
      newItem.value !== '' &&
      newItem.value !== props.multicoin[newItem.symbol].value
    ) {
      acc.push(newItem);
    }
    return acc;
  }, []);
  if (copyMulticoin.length > 0) {
    props.setMulticoin(copyMulticoin);
  } else {
    Toast('No changes were made', {}, WARNING);
  }
};
</script>
