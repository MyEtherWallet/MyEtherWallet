<template>
  <div>
    <mew-popup
      max-width="380px"
      :show="showBlock"
      :left-btn="{
        text: 'Go to block details',
        method: navToBlock,
        color: 'primary'
      }"
      :right-btn="{
        text: 'Close',
        method: close,
        enabled: true
      }"
      :has-buttons="false"
      :has-body-content="true"
    >
      <h2 class="black--text">{{ blockNumber }}</h2>
      <div class="d-flex flex-column align-center justify-end py-5">
        <img :src="img" width="300" height="300" />
      </div>
      <div>
        {{ description }}
      </div>
      <div class="d-flex align-center justify-end mt-5">
        <mew-button
          btn-size="large"
          btn-style="transparent"
          title="Go to block details"
          color-theme="primary"
          @click.native="navToBlock"
        />
        <mew-button
          btn-size="large"
          btn-style="background"
          title="Close"
          color-theme="primary"
          class="ml-1"
          @click.native="close"
        />
      </div>
    </mew-popup>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
export default {
  name: 'DateSelectorPopup',
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
