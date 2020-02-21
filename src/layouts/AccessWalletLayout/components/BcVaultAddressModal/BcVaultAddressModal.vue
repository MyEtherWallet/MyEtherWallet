<template>
  <div>
    <b-modal
      ref="bcvaultAddress"
      title="Select Address"
      hide-footer
      class="bootstrap-modal modal-software"
      centered
      static
      lazy
    >
      <div
        v-for="item in addresses"
        :key="item.address"
        :class="[selected === item.address ? 'selected' : '', 'address']"
        @click="selectAddress"
      >
        <blockie :address="item.address" width="40px" height="40px" />
        <p>{{ item.extraData + item.address }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
export default {
  components: {
    blockie: Blockie
  },
  props: {
    addresses: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      selected: ''
    };
  },
  methods: {
    selectAddress(addr) {
      if (this.selected === addr) {
        this.selected = '';
      } else {
        this.selected = addr;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BcVaultAddressModal.scss';
</style>
