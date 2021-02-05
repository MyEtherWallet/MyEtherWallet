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
        <transfer v-if="isTransfer" :transfer="transfer" />
        <renew v-if="isRenew" :renew="renew" />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import renew from '../components/manage/ManageRenew';
import transfer from '../components/manage/ManageTransfer';
// import { Toast, ERROR } from '@/modules/toast/handler/handlerToast.js';
const types = ['transfer', 'renew'];
export default {
  components: {
    transfer,
    renew
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
  computed: {
    isTransfer() {
      return this.type === types[0];
    },
    isRenew() {
      return this.type === types[1];
    },
    overlayTitle() {
      if (this.isTransfer) {
        return this.$t('ens.transfer-domain');
      }
      if (this.isRenew) {
        return this.$t('ens.renew-domain');
      }
      return this.$t('ens.manage-domain');
    }
  }
};
</script>
