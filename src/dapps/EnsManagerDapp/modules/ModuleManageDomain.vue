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
        <renew v-if="isRenew" :host-name="nameModule.name" :renew="renew" />
        <manage-multicoins
          v-if="isManageMulticoin"
          :host-name="nameModule.name"
          :renew="renew"
        />

        <manage-txt-records
          v-if="isManageTxtRecord"
          :host-name="nameModule.name"
          :renew="renew"
        />

        <manage-upload-website
          v-if="isManageUpload"
          :host-name="nameModule.name"
          :renew="renew"
        />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import renew from '../components/manage/ManageRenew';
import transfer from '../components/manage/ManageTransfer';
import manageMulticoins from '../components/manage/ManageMulticoins';
import manageTxtRecords from '../components/manage/ManageTxtRecords';
import manageUploadWebsite from '../components/manage/ManageUploadWebsite';

// import { Toast, ERROR } from '@/components/toast';
const types = [
  'transfer',
  'renew',
  'manageMulticoin',
  'manageTxtRecord',
  'manageUpload'
];
export default {
  components: {
    transfer,
    renew,
    manageMulticoins,
    manageTxtRecords,
    manageUploadWebsite
  },
  props: {
    nameModule: {
      default: () => {
        return {};
      },
      type: Object
    },
    type: {
      default: '',
      type: String
    },
    renew: {
      default: function () {
        return {};
      },
      type: Function
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
    isManageMulticoin() {
      return this.type === types[2];
    },
    isManageTxtRecord() {
      return this.type === types[3];
    },
    isManageUpload() {
      return this.type === types[4];
    },
    overlayTitle() {
      if (this.isTransfer) {
        return this.$t('ens.transfer-domain');
      }
      if (this.isRenew) {
        return this.$t('ens.manage-domains.renew-domain');
      }
      if (this.isManageMulticoin) {
        return this.$t('ens.manage-domains.manage-multi');
      }
      if (this.isManageTxt) {
        return this.$t('ens.manage-domains.manage-txt');
      }
      if (this.isManageUpload) {
        return this.$t('ens.manage-domains.manage-site');
      }
      return this.$t('ens.manage-domain');
    }
  }
};
</script>
