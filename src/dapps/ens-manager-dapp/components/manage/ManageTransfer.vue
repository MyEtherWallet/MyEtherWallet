<template>
  <div>
    <addressBook @setAddress="setAddress" />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.transfer')"
        btn-size="xlarge"
        :disabled="!isvalid"
        @click.native="transfer(resolvedAddr)"
      />
    </div>
  </div>
</template>

<script>
import addressBook from '@/modules/address-book/ModuleAddressBook';
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
      isvalid: false
    };
  },
  mounted() {
    this.toAddress = '';
    this.resolvedAddr = '';
  },
  methods: {
    setAddress(newVal, isvalid) {
      this.resolvedAddr = newVal;
      this.isvalid = isvalid;
    }
  }
};
</script>
