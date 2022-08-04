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
    <transfer
      v-if="isTransfer"
      ref="transfer"
      :transfer="transfer"
      :manage-domain-handler="manageDomainHandler"
    />
    <renew
      v-if="isRenew"
      :get-rent-price="getRentPrice"
      :host-name="hostName"
      :renew="renew"
      :no-funds-for-renewal-fees="noFundsForRenewalFees"
      :get-total-renew-fee-only="getTotalRenewFeeOnly"
      :loading-renew="loadingRenew"
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
const types = [
  'transfer',
  'renew',
  'manageMulticoin',
  'manageTxtRecord',
  'manageUpload'
];
export default {
  components: {
    renew: () => import('../components/manage/ManageRenew'),
    transfer: () => import('../components/manage/ManageTransfer'),
    manageMulticoins: () => import('../components/manage/ManageMulticoins'),
    manageTxtRecords: () => import('../components/manage/ManageTxtRecords'),
    manageUploadWebsite: () =>
      import('../components/manage/ManageUploadWebsite')
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
    getTotalRenewFeeOnly: {
      default: function () {
        return {};
      },
      type: Function
    },
    settingIpfs: {
      default: false,
      type: Boolean
    },
    noFundsForRenewalFees: {
      default: false,
      type: Boolean
    },
    loadingRenew: {
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
    },
    manageDomainHandler: {
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
