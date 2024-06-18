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

<script setup>
import { computed } from 'vue';
import renew from '../components/manage/ManageRenew.vue';
import transfer from '../components/manage/ManageTransfer.vue';
import manageMulticoins from '../components/manage/ManageMulticoins.vue';
import manageTxtRecords from '../components/manage/ManageTxtRecords.vue';
import manageUploadWebsite from '../components/manage/ManageUploadWebsite.vue';
import { useI18n } from 'vue-i18n-composable';

// injections
const { t } = useI18n();

// props
const props = defineProps({
  hostName: {
    default: '',
    type: String
  },
  type: {
    default: '',
    type: String
  },
  renew: {
    default: () => {},
    type: Function
  },
  getTotalRenewFeeOnly: {
    default: () => {},
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
    default: () => {},
    type: Function
  },
  setTextRecords: {
    default: () => {},
    type: Function
  },
  setMulticoin: {
    default: () => {},
    type: Function
  },
  setIpfs: {
    default: () => {},
    type: Function
  },
  uploadFile: {
    default: () => {},
    type: Function
  },
  uploadedHash: {
    default: '',
    type: String
  },
  onManage: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  },
  getRentPrice: {
    default: () => {},
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
});

// data
const types = [
  'transfer',
  'renew',
  'manageMulticoin',
  'manageTxtRecord',
  'manageUpload'
];

// computed
const isTransfer = computed(() => props.type === types[0]);
const isRenew = computed(() => props.type === types[1]);
const isManageMulticoin = computed(() => props.type === types[2]);
const isManageTxtRecord = computed(() => props.type === types[3]);
const isManageUpload = computed(() => props.type === types[4]);
const overlayTitle = computed(() => {
  if (isTransfer.value) {
    return t('ens.transfer-domain');
  }
  if (isRenew.value) {
    return t('ens.manage-domains.renew-domain');
  }
  if (isManageMulticoin.value) {
    return t('ens.manage-domains.manage-multi');
  }
  if (isManageTxtRecord.value) {
    return t('ens.manage-domains.manage-txt');
  }
  if (isManageUpload.value) {
    return t('ens.manage-domains.upload-site');
  }
  return t('ens.manage-domain');
});
</script>
