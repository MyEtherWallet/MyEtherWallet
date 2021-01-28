<template>
  <div>
    <addressBook @setResolvedAddr="setResolvedAddr" @setToAddr="setToAddr" />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.transfer')"
        btn-size="xlarge"
        @click.native="transfer(address)"
      />
    </div>
  </div>
</template>

<script>
import addressBook from '@/modules/address-book/modules/ModuleAddressBook';
// import { Toast, ERROR } from '@/components/toast';
export default {
  components: {
    addressBook
  },
  props: {
    transfer: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      resolvedAddr: '',
      toAddress: ''
    };
  },
  computed: {
    address() {
      return this.resolvedAddr.length > 0 ? this.resolvedAddr : this.toAddress;
    }
  },
  mounted() {
    this.toAddress = '';
    this.resolvedAddr = '';
  },
  methods: {
    setResolvedAddr(newVal) {
      this.resolvedAddr = newVal;
    },
    setToAddr(newVal) {
      this.toAddress = newVal;
    }
  }
};
</script>
