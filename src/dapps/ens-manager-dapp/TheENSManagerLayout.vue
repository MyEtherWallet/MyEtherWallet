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
          max-width="700px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ $t('ens.search-domain') }}
            </div>
            <form @submit.prevent="findDomain">
              <v-row class="mx-0">
                <v-col class="pr-0" cols="8">
                  <mew-input
                    :value="name"
                    :has-clear-btn="true"
                    :rules="rules"
                    :label="$t('ens.register.domain-name')"
                    :placeholder="$t('ens.ph.three-char')"
                    class="mr-3 flex-grow-1"
                    :error-messages="errorMessages"
                    @input="setName"
                  />
                </v-col>
                <v-col class="pl-0" cols="4">
                  <mew-button
                    :loading="loading"
                    :disabled="
                      !name ||
                      (name && name.length < 3) ||
                      loading ||
                      (name && name.split('.').length > 2)
                    "
                    :has-full-width="true"
                    btn-size="xlarge"
                    :title="$t('ens.register.name')"
                    @click.native="findDomain"
                  />
                </v-col>
              </v-row>
            </form>
          </div>
        </v-sheet>
      </template>
      <!--
    =====================================================================================
      Manage Domain - Tab 2
    =====================================================================================
    -->
      <template #tabContent2>
        <v-sheet class="px-3 py-8 py-md-13">
          <div class="d-flex align-center justify-space-between mb-7">
            <span class="mew-heading-2 font-weight-bold">
              {{ $t('ens.my-domains') }}
              <span class="font-weight-regular">({{ totalDomains }})</span>
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
      </template>
      <template #tabContent3>
        <v-sheet
          max-width="500px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div class="mb-5">
            <!--
            ===================================================
              Claim TITLE: hasEnsTokenBalance
            ===================================================
            -->
            <claim-balance
              :balance="ensTokens.balance"
              :claimed="ensTokens.claimed"
            />
            <form
              v-if="!ensTokens.claimed && hasEnsTokenBalance"
              @submit.prevent="claimTokens"
            >
              <module-address-book
                :label="$t('ens.delegator.addr')"
                :is-valid-address-func="isValidDelegatorAddress"
                preselect-curr-wallet-adr
                @setAddress="setDelegatorAddress"
              />
              <mew-button
                :loading="loading"
                :disabled="isClaimDisabled"
                :has-full-width="true"
                btn-size="xlarge"
                :title="$t('ens.claim-token-title')"
                @click.native="claimTokens"
              />
            </form>
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <!--
    =====================================================================================
      Register Domain Overlay
    =====================================================================================
    -->
    <module-register-domain
      v-if="onRegister"
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
      :uploaded-hash="manageDomainHandler.contentHash"
      :set-text-records="setTextRecords"
      :set-multicoin="setMulticoin"
      :multicoin="manageDomainHandler.multiCoin"
      :text-records="manageDomainHandler.txtRecords"
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
import ClaimBalance from './components/claim/ClaimBalance';
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import ENS from 'ethereum-ens';
import { fromWei, toBN } from 'web3-utils';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import normalise from '@/core/helpers/normalise';
import { isAddress } from '@/core/helpers/addressUtils';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import { hasClaimed, submitClaim } from './handlers/handlerENSTokenClaim';
export default {
  name: 'ENSManagerLayout',
  components: {
    ModuleRegisterDomain,
    ModuleManageDomain,
    TheWrapperDapp,
    ModuleAddressBook,
    ClaimBalance
  },
  data() {
    return {
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
      searchError: '',
      ensTokens: {
        claimed: false,
        balance: '0',
        proof: ''
      },
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
      ],
      tabs: [
        { name: this.$t('ens.register-domain') },
        { name: this.$t('ens.manage-domain') },
        { name: this.$t('ens.claim-tokens') }
      ],
      myDomains: [],
      ensBannerImg: ensBannerImg,
      bannerText: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc')
      },
      delegatorAddress: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    hasEnsTokenBalance() {
      if (this.ensTokens.balance) {
        return toBN(this.ensTokens.balance).gt(toBN(0));
      }
      return false;
    },
    errorMessages() {
      if (this.domainTaken) return this.$t('ens.domain-taken');
      return this.searchError;
    },
    delegatorErrors() {
      if (!isAddress(this.delegatorAddress)) {
        return 'Invalid address!';
      }
      return '';
    },
    isClaimDisabled() {
      return (
        this.ensTokens.claimed ||
        this.delegatorErrors !== '' ||
        this.delegatorAddress === ''
      );
    },
    rules() {
      return [
        this.searchError === '' || this.searchError,
        (this.name && this.name.length > 2) ||
          this.$t('ens.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol'),
        (this.name && this.name.split('.').length <= 2) ||
          this.$t('ens.warning.invalid-symbol')
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
    },
    totalDomains() {
      return formatIntegerToString(this.myDomains.length);
    }
  },
  watch: {
    ensDomainAvailable(newVal) {
      if (newVal === true) {
        this.onRegister = true;
      }
    },
    /* 
    - watches for address state change
    - updates ensManager with new address 
    - if user is onRegister it will reset and take them back
    - if user is onManage it will run getDomain to refresh domains
    */
    address(newVal) {
      this.ensManager.address = newVal;
      if (this.onRegister) {
        this.closeRegister();
      }
      this.getDomains();
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
    hasClaimed(this.address, this.web3).then(data => {
      this.ensTokens.claimed = data.claimed;
      this.ensTokens.balance = data.balance;
      this.ensTokens.proof = data.proof;
    });
  },
  methods: {
    claimTokens() {
      try {
        submitClaim(
          this.ensTokens.balance,
          this.ensTokens.proof,
          this.delegatorAddress,
          this.web3
        );
      } catch (e) {
        this.instance.errorHandler(e);
      }
    },
    setDelegatorAddress(address) {
      this.delegatorAddress = address;
    },
    isValidDelegatorAddress(address) {
      return isAddress(address);
    },
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
        .then(() => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
        })
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    renew(duration) {
      this.manageDomainHandler
        .renew(duration, this.balanceToWei)
        .then(this.getDomains)
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    setMulticoin(coin) {
      this.manageDomainHandler
        .setMulticoin(coin)
        .then(this.getDomains)
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    setTextRecords(records) {
      this.manageDomainHandler
        .setTxtRecord(records)
        .then(this.getDomains)
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    uploadFile(file) {
      this.settingIpfs = true;
      this.manageDomainHandler
        .uploadFile(file)
        .then(res => {
          this.manageDomainHandler.setIPFSHash(res);
        })
        .then(resp => {
          this.settingIpfs = false;
          this.uploadedHash = resp;
          this.closeManage();
        })
        .catch(err => {
          this.instance.errorHandler(err);
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
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    /**
     * Register Domain
     */
    findDomain() {
      try {
        this.nameHandler = this.ensManager.searchName(this.name);
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    closeRegister() {
      this.onRegister = false;
      this.committed = false;
      this.loadingCommit = false;
      this.name = '';
      this.nameHandler = {};
      this.$router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
    },
    setName(name) {
      this.searchError = '';
      if (this.name === null || this.name === '') {
        this.nameHandler = {};
      }
      try {
        this.name = normalise(name);
      } catch (e) {
        this.searchError = e.message.includes('Failed to validate')
          ? 'Invalid name!'
          : e.message;
        this.name = name;
      }
    },
    register(duration) {
      this.nameHandler
        .register(duration, this.balanceToWei)
        .on('transactionHash', () => {
          Toast(`ENS name: ${this.name} registered`, {}, SUCCESS);
          this.closeRegister();
        })
        .once('receipt', () => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
        })
        .on('error', err => {
          this.instance.errorHandler(err);
        });
    },
    commit() {
      let waitingTime;
      this.nameHandler
        .createCommitment()
        .on('transactionHash', () => {
          this.nameHandler.getMinimumAge().then(resp => {
            this.minimumAge = resp;
            waitingTime = parseInt(resp);
          });
        })
        .on('receipt', () => {
          this.loadingCommit = true;
          this.committed = false;
          setTimeout(() => {
            this.committed = true;
            this.loadingCommit = false;
          }, waitingTime * 1000);
        })
        .on('error', err => {
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

.claim-border-container {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
