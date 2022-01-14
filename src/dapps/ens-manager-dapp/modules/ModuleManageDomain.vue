<template>
  <div>
    <v-sheet class="px-3 px-md-13 py-8 py-md-13">
      <div class="d-flex align-center justify-space-between mb-7">
        <span class="mew-heading-2 font-weight-bold">
          {{ $t('ens.my-domains') }}
          <span v-if="!loading" class="font-weight-regular"
            >({{ totalDomains }})</span
          >
        </span>
      </div>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="ma-auto"
      ></v-progress-circular>
      <mew-expand-panel
        v-else
        :idx-to-expand="null"
        class="my-domains-panel"
        :panel-items="myDomains"
        :right-action-text="$t('ens.buy-domain')"
      >
        <template
          v-for="(domain, idx) in myDomains"
          :slot="'panelBody' + (idx + 1)"
        >
          <div
            :key="idx"
            :class="[domain.expired ? 'expired' : 'available', 'ma-3 px-5']"
          >
            <v-row class="subheader-container">
              <v-col cols="12" md="6" class="d-flex align-center">
                <div>{{ $t('ens.manage-domains.registrant') }}</div>
                <mew-blockie
                  :address="domain.registrarAddress"
                  width="25px"
                  height="25px"
                  class="mx-2"
                />
                <mew-transform-hash :hash="domain.registrarAddress" />
                <mew-copy
                  class="ml-2 mew-body"
                  :copy-value="domain.registrarAddress"
                  :is-small="true"
                />
                <a
                  class="address-link"
                  :href="
                    network.type.blockExplorerAddr.replace(
                      '[[address]]',
                      domain.registrarAddress
                    )
                  "
                  target="_blank"
                >
                  <v-icon small class="call-made"> mdi-call-made </v-icon>
                </a>
              </v-col>

              <v-spacer></v-spacer>

              <v-col cols="12" md="6" class="d-flex align-center">
                <div>{{ $t('ens.manage-domains.controller') }}</div>
                <mew-blockie
                  :address="domain.controllerAddress"
                  width="25px"
                  height="25px"
                  class="mx-2"
                />
                <mew-transform-hash :hash="domain.controllerAddress" />
                <mew-copy
                  class="ml-2 mew-body"
                  :copy-value="domain.controllerAddress"
                  :is-small="true"
                />
                <a
                  class="address-link"
                  :href="
                    network.type.blockExplorerAddr.replace(
                      '[[address]]',
                      domain.controllerAddress
                    )
                  "
                  target="_blank"
                >
                  <v-icon small class="call-made"> mdi-call-made </v-icon>
                </a>
              </v-col>
            </v-row>

            <div
              class="d-flex align-center justify-space-between pb-5 pt-8 px-7"
            >
              <span class="mew-heading-3">
                {{ $t('ens.manage-domains.what-to-do') }}
              </span>
            </div>
            <v-divider class="mx-7"></v-divider>
            <v-row class="pa-7">
              <v-col
                v-for="(option, key) in manageDomainOptions"
                v-show="!domain.expired || key === 1"
                :key="key"
                cols="6"
                sm="6"
                md="4"
                lg="2"
              >
                <div
                  class="text-center cursor-pointer"
                  @click="manage(option.type, idx)"
                >
                  <v-icon color="primary" x-large>{{ option.icon }}</v-icon>
                  <div>{{ option.label }}</div>
                  <div
                    v-if="domain.expiration && key === 1"
                    class="orange--text"
                  >
                    <div>
                      {{
                        $t('ens.manage-domains.expire-at', {
                          date: domain.expiration
                        })
                      }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
      </mew-expand-panel>
    </v-sheet>
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      :show-overlay="onManage"
      :title="overlayTitle"
      :close="closeManage"
      content-size="large"
    >
      <transfer v-if="isTransfer" ref="transfer" :transfer="transfer" />
      <renew
        v-if="isRenew"
        :get-rent-price="getRentPrice"
        :host-name="nameHandler.parsedHostName"
        :renew="renew"
      />
      <manage-multicoins
        v-if="isManageMulticoin"
        :set-multicoin="setMulticoin"
        :multicoin="manageDomainHandler.multiCoin"
      />
      <manage-txt-records
        v-if="isManageTxtRecord"
        :set-text-records="setTextRecords"
        :text-records="manageDomainHandler.txtRecords"
      />
      <manage-upload-website
        v-if="isManageUpload"
        :setting-ipfs="settingIpfs"
        :set-ipfs="setIpfs"
        :upload-file="uploadFile"
        :uploaded-hash="manageDomainHandler.contentHash"
      />
    </mew-overlay>
  </div>
</template>

<script>
import renew from '../components/manage/ManageRenew';
import transfer from '../components/manage/ManageTransfer';
import manageMulticoins from '../components/manage/ManageMulticoins';
import manageTxtRecords from '../components/manage/ManageTxtRecords';
import manageUploadWebsite from '../components/manage/ManageUploadWebsite';
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import handlerEnsManager from '../handlers/handlerEnsManager';
import { fromWei } from 'web3-utils';
import ENS from 'ethereum-ens';
import BigNumber from 'bignumber.js';

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
  data() {
    return {
      myDomains: [],
      settingIpfs: false,
      ensManager: {},
      nameHandler: {},
      loading: true,
      onManage: false,
      type: '',
      manageDomainOptions: [
        {
          label: this.$t('ens.transfer-domain'),
          type: 'transfer',
          icon: 'mdi-account-arrow-right'
        },
        {
          label: this.$t('ens.manage-domains.renew-domain'),
          type: 'renew',
          icon: 'mdi-autorenew'
        },
        {
          label: this.$t('ens.manage-domains.manage-multi'),
          type: 'manageMulticoin',
          icon: 'mdi-link'
        },
        {
          label: this.$t('ens.manage-domains.manage-txt'),
          type: 'manageTxtRecord',
          icon: 'mdi-book-open'
        },
        {
          label: this.$t('ens.manage-domains.upload-site'),
          type: 'manageUpload',
          icon: 'mdi-cloud-upload'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['balance', 'address', 'web3']),
    totalDomains() {
      return formatIntegerToString(this.myDomains.length);
    },
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
  },
  mounted() {
    const ens = this.network.type.ens
      ? new ENS(this.web3.currentProvider, this.network.type.ens.registry)
      : null;
    this.ensManager = new handlerEnsManager(
      this.network,
      this.address,
      this.web3,
      ens,
      this.gasPrice
    );

    this.getDomains();
  },
  methods: {
    manage(type, idx) {
      this.onManage = true;
      this.type = type;
      this.manageDomainHandler = this.myDomains[idx];
    },
    getDomains() {
      this.ensManager
        .getAllNamesForAddress()
        .then(res => {
          res.forEach(domain => {
            domain.hasActiveBorder = !domain.expired;
            domain.disabled = domain.expired;
            domain.colorTheme = domain.expired
              ? 'errorOutlineActive'
              : 'superPrimary';
            domain.warningBadge = domain.expired
              ? {
                  color: 'error',
                  text: this.$t('ens.expired')
                }
              : '';
          });
          this.myDomains = res;
          this.loading = false;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    closeManage() {
      this.onManage = false;
      this.settingIpfs = false;
    },
    transfer(address) {
      this.manageDomainHandler
        .transfer(address)
        .then(() => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    renew(duration) {
      this.manageDomainHandler
        .renew(duration, this.balanceToWei)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    setMulticoin(coin) {
      this.manageDomainHandler
        .setMulticoin(coin)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    setTextRecords(records) {
      this.manageDomainHandler
        .setTxtRecord(records)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    uploadFile(file) {
      this.settingIpfs = true;
      this.manageDomainHandler
        .uploadFile(file)
        .then(res => {
          this.manageDomainHandler.setIPFSHash(res);
          this.settingIpfs = false;
          this.closeManage();
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    setIpfs(hash) {
      this.settingIpfs = true;
      this.manageDomainHandler
        .setIPFSHash(hash)
        .then(() => {
          this.settingIpfs = false;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    getRentPrice(duration) {
      const handler = this.onManage
        ? this.manageDomainHandler
        : this.nameHandler;
      return handler.getRentPrice(duration).then(resp => {
        if (resp) {
          const ethValue = fromWei(resp);
          return {
            wei: resp,
            eth: ethValue,
            usd: new BigNumber(ethValue).times(this.fiatValue).toFixed(2)
          };
        }
      });
    }
  }
};
</script>
