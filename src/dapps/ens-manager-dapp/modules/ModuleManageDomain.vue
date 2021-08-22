<template>
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="onManage"
    :title="overlayTitle"
    :close="close"
    content-size="large"
  >
    <transfer v-if="isTransfer" ref="transfer" :transfer="transfer" />
    <renew
      v-if="isRenew"
      :get-rent-price="getRentPrice"
      :host-name="hostName"
      :renew="renew"
    />
    <manage-multicoins
      v-if="isManageMulticoin"
      :set-multicoin="setMulticoin"
      :multicoin="multicoin"
    />
    <manage-txt-records
      v-if="isManageTxtRecord"
      :set-text-records="setTextRecords"
      :text-records="textRecords"
    />
    <manage-upload-website
      v-if="isManageUpload"
      :setting-ipfs="settingIpfs"
      :set-ipfs="setIpfs"
      :upload-file="uploadFile"
      :uploaded-hash="uploadedHash"
    />
  </mew-overlay>
</template>

<script>
import renew from '../components/manage/ManageRenew';
import transfer from '../components/manage/ManageTransfer';
import manageMulticoins from '../components/manage/ManageMulticoins';
import manageTxtRecords from '../components/manage/ManageTxtRecords';
import manageUploadWebsite from '../components/manage/ManageUploadWebsite';

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
    hostName: {
      default: '',
      type: String
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
    settingIpfs: {
      default: false,
      type: Boolean
    },
    transfer: {
      default: function () {
        return {};
      },
      type: Function
    },
    setTextRecords: {
      default: function () {
        return {};
      },
      type: Function
    },
    setMulticoin: {
      default: function () {
        return {};
      },
      type: Function
    },
    setIpfs: {
      default: function () {
        return {};
      },
      type: Function
    },
    uploadFile: {
      default: function () {
        return {};
      },
      type: Function
    },
    uploadedHash: {
      default: '',
      type: String
    },
    onManage: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    getRentPrice: {
      default: function () {
        return {};
      },
      type: Function
    },
    multicoin: {
      type: [Object, null],
      default: null
    },
    textRecords: {
      type: [Object, null],
      default: null
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
      if (this.isManageTxtRecord) {
        return this.$t('ens.manage-domains.manage-txt');
      }
      if (this.isManageUpload) {
        return this.$t('ens.manage-domains.upload-site');
      }
      return this.$t('ens.manage-domain');
    }
  }
};
</script>
