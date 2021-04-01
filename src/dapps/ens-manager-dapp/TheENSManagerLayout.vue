<template>
  <!--
    =====================================================================================
      ENS Manager Dapp Layout
    =====================================================================================
    -->
  <div>
    <the-wrapper-dapp
      :has-exit-btn="true"
      :banner-img="ensBannerImg"
      :banner-text="bannerText"
      :tab-items="tabs"
      :active-tab="activeTab"
    >
      <!--
    =====================================================================================
      Register Domain - Tab 1
    =====================================================================================
    -->
      <template #tabContent1>
        <v-sheet
          min-height="500px"
          max-width="700px"
          color="transparent"
          class="py-15 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ $t('ens.search-domain') }}
            </div>
            <div class="d-flex align-start">
              <mew-input
                :error-messages="domainTaken ? $t('ens.domain-taken') : null"
                :value="name"
                :has-clear-btn="true"
                :rules="rules"
                :label="$t('ens.register.domain-name')"
                :placeholder="$t('ens.ph.three-char')"
                class="mr-3 flex-grow-1"
                @input="setName"
              />
              <mew-button
                :loading="loading"
                :disabled="(name && name.length === 0) || loading"
                :has-full-width="false"
                btn-size="xlarge"
                :title="$t('ens.register-domain')"
                @click.native="findDomain"
              />
            </div>
          </div>
        </v-sheet>
      </template>
      <!--
    =====================================================================================
      Manage Domain - Tab 2
    =====================================================================================
    -->
      <template #tabContent2>
        <v-sheet min-height="500px" class="pa-12">
          <div class="d-flex align-center justify-space-between mb-7">
            <span class="mew-heading-2 font-weight-bold">
              {{ $t('ens.my-domains') }}
              <span class="font-weight-regular">({{ myDomains.length }})</span>
            </span>
          </div>
          <mew-expand-panel
            :idx-to-expand="null"
            class="my-domains-panel"
            :panel-items="myDomains"
            :right-action-text="$t('ens.buy-domain')"
            @onActionClick="buyDomain"
          >
            <template
              v-for="(domain, idx) in myDomains"
              :slot="'panelBody' + (idx + 1)"
              :class="domain.expired ? 'expired' : 'available'"
            >
              <div :key="idx">
                <div
                  class="px-7 d-flex justify-space-between py-5 subheader-container"
                >
                  <div class="d-flex align-center">
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
                        'https://www.ethvm.com/address/' +
                        domain.registrarAddress
                      "
                      target="_blank"
                    >
                      <v-icon small class="call-made"> mdi-call-made </v-icon>
                    </a>
                  </div>
                  <div class="d-flex align-center justify-end">
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
                        'https://www.ethvm.com/address/' +
                        domain.controllerAddress
                      "
                      target="_blank"
                    >
                      <v-icon small class="call-made"> mdi-call-made </v-icon>
                    </a>
                  </div>
                </div>
                <div
                  class="mt-3 d-flex align-center justify-space-between py-5 px-7"
                >
                  <span class="mew-heading-3">
                    {{ $t('ens.manage-domains.what-to-do') }}
                  </span>
                </div>
                <v-divider class="mx-7"></v-divider>
                <v-row class="pa-7">
                  <v-col
                    v-for="(option, key) in manageDomainOptions"
                    :key="key"
                    cols="2"
                    class="text-center"
                  >
                    <mew-icon
                      class="cursor-pointer"
                      icon-name="ensManager"
                      :img-height="70"
                      @click.native="manage(option.type, idx)"
                    />
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
                  </v-col>
                </v-row>
              </div>
            </template>
          </mew-expand-panel>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <!--
    =====================================================================================
      Register Domain Overlay
    =====================================================================================
    -->
    <module-register-domain
      ref="registerDomain"
      :on-register="onRegister"
      :close="closeRegister"
      :register="register"
      :loading-commit="loadingCommit"
      :commited="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :name="nameHandler.name"
      :parsed-host-name="nameHandler.parsedHostName"
      :checking-domain-avail="loading"
      :generate-key-phrase="generateKeyPhrase"
      :get-rent-price="getRentPrice"
    />
    <!--
    =====================================================================================
      Manage Domain Overlay
    =====================================================================================
    -->
    <module-manage-domain
      ref="manageDomain"
      :setting-ipfs="settingIpfs"
      :on-manage="onManage"
      :close="closeManage"
      :type="manageType"
      :transfer="transfer"
      :renew="renew"
      :upload-file="uploadFile"
      :set-text-records="setTextRecords"
      :set-multicoin="setMulticoin"
      :set-ipfs="setIpfs"
      :host-name="manageDomainHandler.parsedHostName"
      :get-rent-price="getRentPrice"
    />
  </div>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import ensBannerImg from '@/assets/images/backgrounds/bg-ens.png';
import ModuleRegisterDomain from './modules/ModuleRegisterDomain';
import ModuleManageDomain from './modules/ModuleManageDomain';
import handlerEnsManager from './handlers/handlerEnsManager';
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import { EventBus } from '@/core/plugins/eventBus';
import EventNames from '@/utils/web3-provider/events.js';
import ENS from 'ethereum-ens';
import { fromWei, toBN } from 'web3-utils';

export default {
  components: { ModuleRegisterDomain, ModuleManageDomain, TheWrapperDapp },
  data() {
    return {
      nameNull: false,
      activeTab: 0,
      loadingCommit: false,
      minimumAge: '',
      committed: false,
      settingIpfs: false,
      manageDomainHandler: {},
      manageType: '',
      onManage: false,
      name: '',
      nameHandler: {},
      ensManager: {},
      onRegister: false,
      manageDomainOptions: [
        { label: this.$t('ens.transfer-domain'), type: 'transfer' },
        {
          label: this.$t('ens.manage-domains.renew-domain'),
          type: 'renew'
        },
        {
          label: this.$t('ens.manage-domains.manage-multi'),
          type: 'manageMulticoin'
        },
        {
          label: this.$t('ens.manage-domains.manage-txt'),
          type: 'manageTxtRecord'
        },
        {
          label: this.$t('ens.manage-domains.upload-site'),
          type: 'manageUpload'
        }
      ],
      tabs: [
        { name: this.$t('ens.register-domain') },
        { name: this.$t('ens.manage-domain') }
      ],
      myDomains: [],
      ensBannerImg: ensBannerImg,
      bannerText: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc')
      }
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapState('wallet', ['balance', 'address', 'web3']),
    rules() {
      return [
        (this.name && this.name.length > 2) ||
          this.$t('ens.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol'),
        !this.domainTaken || this.$t('ens.domain-taken')
      ];
    },
    hasInvalidChars() {
      const letters = /^[0-9a-zA-Z_.-]+$/;
      if (!letters.test(this.name)) {
        return true;
      }
      return false;
    },
    balanceToWei() {
      return this.web3.utils.toWei(BigNumber(this.balance).toString(), 'ether');
    },
    loading() {
      return this.nameHandler.checkingDomainAvail;
    },
    ensDomainAvailable() {
      return this.nameHandler.isAvailable;
    },
    isNameEmpty() {
      return this.name === null || this.name === '';
    },
    domainTaken() {
      return (
        !this.isNameEmpty &&
        !this.loading &&
        !this.ensDomainAvailable &&
        Object.keys(this.nameHandler).length !== 0
      );
    }
  },
  watch: {
    ensDomainAvailable(newVal) {
      if (newVal === true) {
        this.onRegister = true;
      }
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
    buyDomain() {
      this.activeTab = 0;
    },
    /**
     * Manage Domain
     */
    manage(type, idx) {
      this.onManage = true;
      this.manageType = type;
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
        .then(this.getDomains)
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
        .then(this.manageDomainHandler.setIPFSHash)
        .then(resp => {
          this.settingIpfs = false;
          this.uploadedHash = resp;
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
    /**
     * Register Domain
     */
    findDomain() {
      /**
       * make sure there is no empty string after '.'
       */
      const strLength = this.name.length;
      const name =
        this.name[strLength - 1] === '.'
          ? this.name.substring(0, strLength - 1)
          : this.name;
      this.ensManager
        .searchName(name)
        .then(res => {
          this.nameHandler = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    closeRegister() {
      this.onRegister = false;
      this.committed = false;
      this.name = '';
      this.nameHandler = {};
      this.$refs.registerDomain.reset();
    },
    setName(name) {
      if (this.name === null || this.name === '') {
        this.nameHandler = {};
      }
      this.name = name;
    },
    register() {
      this.nameHandler
        .register(this.duration, this.balanceToWei)
        .then(this.closeRegister)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    commit() {
      this.nameHandler.getMinimumAge().then(resp => {
        this.minimumAge = resp;
      });
      /**
       * start timer after confirming tx
       */
      EventBus.$on(EventNames.CONFIRMED_TX, () => {
        this.loadingCommit = true;
      });
      this.nameHandler
        .createCommitment()
        .then(() => {
          this.loadingCommit = false;
          this.committed = true;
        })
        .catch(err => {
          this.closeRegister();
          Toast(err, {}, ERROR);
        });
    },
    generateKeyPhrase() {
      if (this.nameHandler.generateKeyPhrase) {
        this.nameHandler.generateKeyPhrase();
      }
    },
    getRentPrice(duration) {
      const handler = this.onManage
        ? this.manageDomainHandler
        : this.nameHandler;
      return handler.getRentPrice(duration).then(resp => {
        if (resp) {
          const priceFromWei = fromWei(toBN(resp));
          return {
            eth: new BigNumber(priceFromWei).toFixed(4),
            usd: new BigNumber(priceFromWei)
              .times(this.ETHUSDValue.value)
              .toFixed(2)
          };
        }
      });
    }
  }
};
</script>
<style lang="scss">
.my-domains-panel {
  .active-border {
    .subheader-container {
      background-color: var(--v-superPrimary-base);
      div {
        max-width: 400px;
      }
    }
  }
}
</style>
