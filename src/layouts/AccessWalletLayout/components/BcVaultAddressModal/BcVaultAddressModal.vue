<template>
  <div>
    <b-modal
      ref="bcvaultAddress"
      title="Select Address"
      hide-footer
      class="bootstrap-modal"
      centered
      static
      lazy
    >
      <div class="bcvault-address">
        <div
          v-for="item in addresses"
          :key="item.address"
          :class="[
            selected === item.extraData + item.address ? 'selected' : '',
            'address'
          ]"
          @click="selectAddress(item.extraData + item.address)"
        >
          <blockie
            :address="item.extraData + item.address"
            width="40px"
            height="40px"
          />
          <div>
            <p v-show="item.userData !== '' && item.userData !== null"> {{ item.userData }}</p>
            <p>{{ item.extraData + item.address }}</p>
          <div>
        </div>
        <div
          :class="[selected !== '' ? '' : 'disable', 'submit-button']"
          @click="callbackFn(selected)"
        >
          Unlock Wallet
        </div>
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
    },
    callbackFn: {
      type: Function,
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
