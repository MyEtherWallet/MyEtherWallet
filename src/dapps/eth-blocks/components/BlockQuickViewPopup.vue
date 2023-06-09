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

<script>
import { isEmpty } from 'lodash';

import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
export default {
  name: 'DateSelectorPopup',
  components: { AppModal: () => import('@/core/components/AppModal') },
  props: {
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
  },
  computed: {
    isReady() {
      return !isEmpty(this.blockHandler) && !this.isLoading;
    },
    img() {
      return this.isReady ? this.blockHandler.img : '';
    },
    blockNumber() {
      return this.isReady
        ? formatIntegerToString(this.blockHandler.blockNumber)
        : '';
    },
    description() {
      return this.isReady ? this.blockHandler.description.toString() : '';
    }
  },
  methods: {
    close() {
      this.$emit('hide-block-quick-view');
    },
    navToBlock() {
      this.$emit('navigate-to-block-info');
    }
  }
};
</script>
