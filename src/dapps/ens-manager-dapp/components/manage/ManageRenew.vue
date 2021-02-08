<template>
  <div>
    <addressBook @setAddress="setAddress" />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.transfer')"
        btn-size="xlarge"
        @click.native="transfer(toAddress)"
      />
    </div>
  </div>
</template>

<script>
// import addressBook from '@/modules/address-book/ModuleAddressBook';
// import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default {
  // components: {
  //   addressBook
  // },
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
      toAddress: ''
    };
  },
  mounted() {
    this.toAddress = '';
  },
  methods: {
    setAddress(newVal) {
      this.toAddress = newVal;
    }
  }
};
</script>
