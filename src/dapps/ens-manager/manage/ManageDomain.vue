<template>
  <mew-overlay
    :show-overlay="onManage"
    :title="overlayTitle"
    :right-btn-text="$t('common.cancel')"
    :close="close"
  >
    <template #mewOverlayBody>
      <v-sheet
        class="pa-12 rounded -flex align-center justify-center"
        color="white"
        min-width="600"
      >
        <addressBook
          @setResolvedAddr="setResolvedAddr"
          @setToAddr="setToAddr"
        />
        <div class="d-flex align-center justify-center mt-3">
          <mew-button
            :title="$t('ens.transfer')"
            btn-size="xlarge"
            @click.native="transfer(address)"
          />
        </div>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import addressBook from '@/modules/addressBook/AddressBook';
// import { Toast, ERROR } from '@/components/toast';
const types = ['transfer'];
export default {
  components: {
    addressBook
  },
  props: {
    type: {
      default: '',
      type: String
    },
    transfer: {
      default: function () {
        return {};
      },
      type: Function
    },
    onManage: { default: false, type: Boolean },
    close: {
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
    },
    overlayTitle() {
      if (this.type === types[0]) {
        return this.$t('ens.transfer-domain');
      }
      return this.$t('ens.manage-domain');
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
