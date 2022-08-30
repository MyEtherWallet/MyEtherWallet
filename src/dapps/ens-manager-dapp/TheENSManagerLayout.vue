<template>
  <!--
    =====================================================================================
      ENS Manager Dapp Layout
    =====================================================================================
    -->
  <div>
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="header"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
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
                      <v-icon color="greenPrimary" x-large>{{
                        option.icon
                      }}</v-icon>
                      <div>{{ option.label }}</div>
                      <div
                        v-if="domain.expiration && key === 1"
                        class="orange--text"
                      >
                        <div>
                          {{
                            $t('ens.manage-domains.expire-on', {
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
      <!--
    =====================================================================================
      Reverse Lookup - Tab 4
    =====================================================================================
    -->
      <template #tabContent4>
        <v-sheet
          max-width="500px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div>
            <ens-reverse-lookup
              :address="address"
              :ens-manager="ensManager"
              :name="name"
              :duration-pick="durationPick"
            />
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
      :not-enough-funds="notEnoughFunds"
      :loading-commit="loadingCommit"
      :loading-reg="loadingReg"
      :commited="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :no-funds-for-reg-fees="noFundsForRegFees"
      :commit-fee-in-eth="commitFeeInEth"
      :commit-fee-in-wei="commitFeeInWei"
      :commit-fee-usd="commitFeeUsd"
      :total-cost-usd="totalCostUsd"
      :total-cost="totalCost"
      :name="nameHandler.name"
      :parsed-host-name="nameHandler.parsedHostName"
      :checking-domain-avail="loading"
      :generate-key-phrase="generateKeyPhrase"
      :get-rent-price="getRentPrice"
      :waiting-for-reg="waitingForReg"
      @getCommitFeeOnly="getCommitFeeOnly"
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
      :no-funds-for-renewal-fees="noFundsForRenewalFees"
      :loading-renew="loadingRenew"
      :upload-file="uploadFile"
      :uploaded-hash="manageDomainHandler.contentHash"
      :set-text-records="setTextRecords"
      :set-multicoin="setMulticoin"
      :multicoin="manageDomainHandler.multiCoin"
      :text-records="manageDomainHandler.txtRecords"
      :set-ipfs="setIpfs"
      :host-name="manageDomainHandler.parsedHostName"
      :get-rent-price="getRentPrice"
      :get-total-renew-fee-only="getTotalRenewFeeOnly"
      :manage-domain-handler="manageDomainHandler"
    />
  </div>
</template>

<script>
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import ModuleRegisterDomain from './modules/ModuleRegisterDomain';
import ModuleManageDomain from './modules/ModuleManageDomain';
import handlerEnsManager from './handlers/handlerEnsManager';
import ClaimBalance from './components/claim/ClaimBalance';
import EnsReverseLookup from './components/reverse/EnsReverseLookup';
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import ENS from '@ensdomains/ensjs';
import { fromWei, toBN, toWei } from 'web3-utils';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ENS_MANAGER_ROUTE } from './configsRoutes';
import normalise from '@/core/helpers/normalise';
import { isAddress } from '@/core/helpers/addressUtils';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import { hasClaimed, submitClaim } from './handlers/handlerENSTokenClaim';
import stripQuery from '@/core/helpers/stripQuery.js';

export default {
  name: 'ENSManagerLayout',
  components: {
    ModuleRegisterDomain,
    ModuleManageDomain,
    TheWrapperDapp,
    ModuleAddressBook,
    ClaimBalance,
    EnsReverseLookup
  },
  data() {
    return {
      validNetworks: SUPPORTED_NETWORKS,
      headerImg: require('@/assets/images/icons/icon-ens-manager-white-bg.svg'),
      header: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc')
      },
      activeTab: 0,
      loadingCommit: false,
      loadingReg: false,
      loadingRenew: false,
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
      notEnoughFunds: false,
      noFundsForRegFees: false,
      noFundsForRenewalFees: false,
      durationPick: '',
      commitFeeInEth: '',
      commitFeeInWei: '0',
      commitFeeUsd: '0',
      renewalInEth: '',
      renewalInWei: '',
      renewalInUsd: '0',
      regFee: '0',
      totalCost: '0',
      totalCostUsd: '0',
      waitingForReg: true,
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
        {
          name: this.$t('ens.register-domain'),
          route: { name: ENS_MANAGER_ROUTE.CORE.NAME },
          id: 0
        },
        {
          name: this.$t('ens.manage-domain'),
          route: {
            name: ENS_MANAGER_ROUTE.MANAGE.NAME,
            path: ENS_MANAGER_ROUTE.MANAGE.PATH
          },
          id: 1
        },
        {
          name: this.$t('ens.claim-tokens'),
          route: {
            name: ENS_MANAGER_ROUTE.CLAIM.NAME,
            path: ENS_MANAGER_ROUTE.CLAIM.PATH
          },
          id: 2
        },
        {
          name: this.$t('ENS Reverse Lookup'),
          route: {
            name: ENS_MANAGER_ROUTE.REVERSE.NAME,
            path: ENS_MANAGER_ROUTE.REVERSE.PATH
          },
          id: 3
        }
      ],
      /*
      tabs: [
        { name: this.$t('ens.register-domain') },
        { name: this.$t('ens.manage-domain') },
        { name: this.$t('ens.claim-tokens') }
      ],
      */
      myDomains: [],
      /*,
      ensBannerImg: ensBannerImg,
      bannerText: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc')
      }
      */
      delegatorAddress: ''
    };
  },
  computed: {
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('global', ['gasPriceType']),
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
      return toWei(BigNumber(this.balance).toString(), 'ether');
    },
    loading() {
      return this.nameHandler?.checkingDomainAvail;
    },
    ensDomainAvailable() {
      return this.nameHandler?.isAvailable;
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
    },
    $route() {
      this.detactUrlChangeTab();
    }
  },
  beforeMount() {
    this.setTokenFromURL();
  },
  mounted() {
    /**
     * Check url and change tab on load
     */
    this.detactUrlChangeTab();

    const ens = this.network.type.ens
      ? new ENS({
          provider: this.web3.eth.currentProvider,
          ensAddress: this.network.type.ens.registry
        })
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
    detactUrlChangeTab() {
      const currentRoute = this.$route.name;
      if (currentRoute === ENS_MANAGER_ROUTE.MANAGE.NAME) {
        this.activeTab = this.tabs[1].id;
      } else if (currentRoute === ENS_MANAGER_ROUTE.CLAIM.NAME) {
        this.activeTab = this.tabs[2].id;
      } else if (currentRoute === ENS_MANAGER_ROUTE.REVERSE.NAME) {
        this.activeTab = this.tabs[3].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    },
    tabChanged(tab) {
      this.activeTab = tab;
    },
    setTokenFromURL() {
      if (Object.keys(this.$route.query).length > 0) {
        const { active } = stripQuery(this.$route.query);
        this.activeTab = BigNumber(active).toNumber();
      }
    },
    claimTokens() {
      try {
        submitClaim(
          this.ensTokens.balance,
          this.ensTokens.proof,
          this.delegatorAddress,
          this.web3
        ).catch(this.instance.errorHandler);
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
      this.trackDapp('ensBuyDomainTab');
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
            domain.colorTheme = domain.expired ? 'redMedium' : 'greyLight';
            domain.warningBadge = domain.expired
              ? {
                  color: 'redPrimary',
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
      this.trackDapp('closeEnsManageTab');
    },
    transfer(address) {
      this.trackDapp('ensDomainTransferEvent');
      this.manageDomainHandler
        .transfer(address)
        .then(() => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
          this.trackDapp('ensTransferred');
        })
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },

    async getTotalRenewFeeOnly(duration) {
      this.loadingRenew = true;
      const renewFeeOnly = await this.manageDomainHandler.totalRenewCost(
        duration
      ); // ETH
      if (!renewFeeOnly) {
        this.noFundsForRenewalFees = true;
      } else {
        this.renewalInEth = renewFeeOnly;
        this.renewalInWei = toWei(renewFeeOnly);
        this.renewalInUsd = new BigNumber(this.renewalInEth)
          .times(this.fiatValue)
          .toFixed(2);
        if (toBN(this.renewalInWei).gte(this.balance)) {
          // commit fee vs current user balance in wei
          this.noFundsForRenewalFees = true;
        } else {
          this.noFundsForRenewalFees = false;
        }
      }
      this.loadingRenew = false;
    },

    renew(duration) {
      this.manageDomainHandler
        .renew(duration, this.balanceToWei)
        .then(() => {
          this.getDomains;
          this.trackDapp('ensDomainRenew');
        })
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
          this.trackDapp('ensFileUpload');
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
          this.trackDapp('ensSetIpfs');
        })
        .catch(err => {
          this.instance.errorHandler(err);
        });
      this.closeManage();
    },
    async findDomain() {
      try {
        this.nameHandler = await this.ensManager.searchName(this.name);
        this.trackDapp('findEnsDomain');
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    closeRegister() {
      this.onRegister = false;
      this.committed = false;
      this.loadingCommit = false;
      this.loadingReg = false;
      this.name = '';
      this.nameHandler = {};
      this.$router.push({ name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME });
      this.trackDapp('closeEnsRegister');
    },
    setName(name) {
      this.searchError = '';
      if (this.name === null || this.name === '') {
        this.nameHandler = {};
      }
      try {
        this.name = normalise(name);
        this.trackDapp('setEnsDomainName');
      } catch (e) {
        this.searchError = e.message.includes('Failed to validate')
          ? 'Invalid name!'
          : e.message;
        this.name = name;
      }
    },
    register(duration) {
      this.trackDapp('ensDomainRegisterEvent');
      this.nameHandler
        .register(duration, this.balanceToWei)
        .on('transactionHash', () => {
          Toast(
            `Registering ENS name: ${this.name} please wait...`,
            {},
            SUCCESS
          );
          this.loadingReg = true;
        })
        .once('receipt', () => {
          setTimeout(() => {
            this.getDomains();
          }, 15000);
          this.closeRegister();
          this.trackDapp('ensDomainRegisterReceipt');
          Toast(`Registration successful!`, {}, SUCCESS);
        })
        .on('error', err => {
          this.instance.errorHandler(err);
        });
    },
    commit() {
      let waitingTime;
      this.trackDapp('ensDomainCommitEvent');
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
          this.waitingForReg = true;
          this.trackDapp('ensDomainCommittReceipt');
          setTimeout(() => {
            this.committed = true;
            this.waitingForReg = false;
            this.getTotalCost(); //calling total cost for regfees
          }, waitingTime * 1000);
        })
        .on('error', err => {
          Toast(err, {}, ERROR);
        });
    },

    async getCommitFeeOnly() {
      const commitFeeOnly = await this.nameHandler.getCommitmentFees(); // ETH
      this.commitFeeInEth = commitFeeOnly.toString();
      this.commitFeeInWei = toWei(commitFeeOnly);
      this.commitFeeUsd = this.getFiatValue(
        new BigNumber(this.commitFeeInEth).times(this.fiatValue).toFixed(2)
      );
      if (toBN(this.commitFeeInWei).gte(this.balance)) {
        // commit fee vs current user balance in wei
        this.notEnoughFunds = true;
      } else {
        this.notEnoughFunds = false;
      }
    },

    async getTotalCost() {
      const registerFeesOnly = await this.nameHandler.getRegFees(
        this.durationPick,
        this.balance
      );
      if (!registerFeesOnly) {
        this.noFundsForRegFees = true;
      } else {
        this.regFee = registerFeesOnly;
        const feesAdded =
          BigNumber(this.regFee) + BigNumber(this.commitFeeInEth);
        this.totalCost = feesAdded.toString();
        this.totalCostUsd = new BigNumber(this.totalCost)
          .times(this.fiatValue)
          .toFixed(2);
        if (this.totalCost >= this.balance) {
          this.noFundsForRegFees = true;
        } else {
          this.noFundsForRegFees = false;
        }
      }
      this.loadingCommit = false;
    },

    generateKeyPhrase() {
      if (this.nameHandler.generateKeyPhrase) {
        this.nameHandler.generateKeyPhrase();
      }
    },

    getRentPrice(duration) {
      this.durationPick = duration;
      const handler = this.onManage
        ? this.manageDomainHandler
        : this.nameHandler;
      return handler.getRentPrice(this.durationPick).then(resp => {
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

<style lang="scss" scoped>
.my-domains-panel {
  .active-border {
    .subheader-container {
      background-color: var(--v-greyLight-base);
      div {
        max-width: 400px;
      }
    }
  }
}
</style>
