<template>
  <div class="full-width">
    <div v-for="(key, idx) in keys" :key="`${key}${idx}`">
      <mew-input
        :id="idx"
        v-model="setRecords[key]"
        class="mb-2"
        :error-messages="errors[key]"
        :label="key"
        :placeholder="key"
        @input="validateRecord"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="!isValid"
        @click.native="callSetRecords"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { isEmpty } from 'lodash';
import { useI18n } from 'vue-i18n-composable';

import textValidator from '@/dapps/ens-manager-dapp/handlers/handlerTextRecords';
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';

const { t } = useI18n();

// props
const props = defineProps({
  setTextRecords: {
    default: () => {},
    type: Function
  },
  textRecords: {
    type: [Object, null],
    default: null
  }
});

// data
const locErrors = ref({});
const locRecords = ref({});

for (const type in props.textRecords) {
  locErrors.value[type] = '';
  // eslint-disable-next-line
  locRecords.value[type] = props.multicoin[type];
}

const setRecords = ref(locRecords.value);
const errors = ref(locErrors.value);

// computed
const hasError = computed(() => {
  return (
    Object.values(errors.value).filter(item => {
      if (item !== '') return item;
    }).length > 0
  );
});

const isValid = computed(() => {
  return !hasError.value && !isEmpty(props.setRecords.value);
});

const keys = computed(() => {
  return Object.keys(props.textRecords);
});

// watch
watch(
  () => props.textRecords,
  newVal => {
    Object.keys(newVal).forEach(item => {
      setRecords.value[item] = newVal[item];
      errors.value[item] = '';
    });
  },
  { deep: true, immediate: true }
);

// methods
const validateRecord = (value, id) => {
  const name = keys.value[id];
  if (value) {
    errors.value[name] = textValidator[id].validate(value)
      ? ''
      : t('ens.text-record-error', {
          name: name
        });
  } else {
    errors.value[name] = '';
  }
};

const callSetRecords = () => {
  const newObj = {};
  Object.keys(setRecords.value)
    .filter(item => {
      // Make sure text record is not null
      if (!setRecords.value[item]) setRecords.value[item] = '';
      // Filters out unchanged values
      if (props.textRecords.value[item] !== setRecords.value[item]) return item;
    })
    .forEach(item => {
      newObj[item] = setRecords.value[item];
    });
  if (!isEmpty(newObj)) {
    props.setTextRecords(newObj);
  } else {
    Toast('No changes found!', {}, WARNING);
  }
};
</script>
