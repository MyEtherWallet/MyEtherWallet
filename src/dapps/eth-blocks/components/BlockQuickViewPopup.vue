<template>
  <div class="dapps--eth-blocks--block-quick-view-popup">
    <app-modal
      width="380px"
      :show="showBlock"
      :has-buttons="false"
      :has-close-button="true"
      :close="close"
    >
      <template #dialogBody>
        <h2 class="textDark--text">{{ blockNumber }}</h2>
        <div class="d-flex flex-column align-center justify-end py-5">
          <img :src="img" width="300" height="300" />
        </div>
        <div class="textDark--text">
          {{ description }}
        </div>

        <div
          class="primary--text font-weight-medium cursor--pointer mt-3"
          @click="navToBlock"
        >
          View Block details
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { isEmpty } from 'lodash';

import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';

// emits
const emits = defineEmits(['hide-block-quick-view', 'navigate-to-block-info']);

// props
const props = defineProps({
  showBlock: {
    type: Boolean,
    default: false
  },
  blockHandler: {
    type: Object,
    default: () => {}
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// computed
const isReady = computed(
  () => !isEmpty(props.blockHandler) && !props.isLoading
);
const img = computed(() => (isReady.value ? props.blockHandler.img : ''));
const blockNumber = computed(() =>
  isReady.value ? formatIntegerToString(props.blockHandler.blockNumber) : ''
);
const description = computed(() =>
  isReady.value ? props.blockHandler.description.toString() : ''
);

// methods
const close = () => emits('hide-block-quick-view');
const navToBlock = () => emits('navigate-to-block-info');
</script>
