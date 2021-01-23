<template>
  <div>
    <mew-input
      :value="ipfs"
      :label="$t('ens.content-hash')"
      :placeholder="$t('ens.enter-hash')"
      @input="setHash"
    />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.set-hash')"
        btn-size="xlarge"
        @click.native="setIPFS(ipfs)"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  props: {
    setIPFS: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      ipfs: ''
    };
  },
  methods: {
    setHash(val) {
      this.ipfs = val;
    }
  }
};
</script>
