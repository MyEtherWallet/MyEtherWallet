<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
// import ensBannerImg from '@/assets/images/backgrounds/bg-ens.png';
// import ModuleRegisterDomain from './modules/ModuleRegisterDomain';
// import ModuleManageDomain from './modules/ModuleManageDomain';
// import handlerEnsManager from './handlers/handlerEnsManager';
// import ClaimBalance from './components/claim/ClaimBalance';
// import { mapGetters, mapState } from 'vuex';
// import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
// import BigNumber from 'bignumber.js';
// import ENS from 'ethereum-ens';
// import { fromWei, toBN } from 'web3-utils';
// import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
// import { ROUTES_WALLET } from '@/core/configs/configRoutes';
// import normalise from '@/core/helpers/normalise';
// import { isAddress } from '@/core/helpers/addressUtils';
// import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
// import { hasClaimed, submitClaim } from './handlers/handlerENSTokenClaim';
import { ENS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';

export default {
  name: 'ENSManagerLayout',
  components: {
    TheWrapperDapp
    // ModuleRegisterDomain,
    // ModuleManageDomain,
    // TheWrapperDapp,
    // ModuleAddressBook,
    // ClaimBalance
  },

  data() {
    return {
      header: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc')
      },
      activeTab: 0,
      tabs: [
        {
          name: this.$t('ens.register-domain'),
          route: { name: ENS_ROUTE.CORE.NAME },
          id: 0
        },
        {
          name: this.$t('ens.manage-domain'),
          route: {
            name: ENS_ROUTE.MANAGE.NAME
          },
          id: 1
        },
        {
          name: this.$t('ens.claim-tokens'),
          route: {
            name: ENS_ROUTE.CLAIM.NAME
          },
          id: 2
        }
      ],
      headerImg: require('@/assets/images/icons/icon-ens-logo.svg'),
      validNetworks: SUPPORTED_NETWORKS
      // checkPendingInterval: false
    };
  },

  watch: {
    $route(to) {
      if (to.name === ENS_ROUTE.MANAGE.NAME) {
        this.activeTab = this.tabs[1].id;
      } else if (to.name === ENS_ROUTE.CLAIM.NAME) {
        this.activeTab = this.tabs[2].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    }
  },
  mounted() {
    if (this.$route.name === ENS_ROUTE.MANAGE.NAME) {
      this.activeTab = this.tabs[1].id;
    }
    if (this.$route.name === ENS_ROUTE.CLAIM.NAME) {
      this.activeTab = this.tabs[2].id;
    }
  }

  // data() {
  //   return {
  //     loadingCommit: false,
  //     minimumAge: '',
  //     committed: false,
  //     settingIpfs: false,
  //     manageDomainHandler: {},
  //     manageType: '',
  //     onManage: false,
  //     name: '',
  //     nameHandler: {},
  //     ensManager: {},
  //     onRegister: false,
  //     searchError: '',
  //     ensTokens: {
  //       claimed: false,
  //       balance: '0',
  //       proof: ''
  //     },
  //     manageDomainOptions: [
  //       {
  //         label: this.$t('ens.transfer-domain'),
  //         type: 'transfer',
  //         icon: 'mdi-account-arrow-right'
  //       },
  //       {
  //         label: this.$t('ens.manage-domains.renew-domain'),
  //         type: 'renew',
  //         icon: 'mdi-autorenew'
  //       },
  //       {
  //         label: this.$t('ens.manage-domains.manage-multi'),
  //         type: 'manageMulticoin',
  //         icon: 'mdi-link'
  //       },
  //       {
  //         label: this.$t('ens.manage-domains.manage-txt'),
  //         type: 'manageTxtRecord',
  //         icon: 'mdi-book-open'
  //       },
  //       {
  //         label: this.$t('ens.manage-domains.upload-site'),
  //         type: 'manageUpload',
  //         icon: 'mdi-cloud-upload'
  //       }
  //     ],
  //     tabs: [
  //       { name: this.$t('ens.register-domain') },
  //       { name: this.$t('ens.manage-domain') },
  //       { name: this.$t('ens.claim-tokens') }
  //     ],
  //     myDomains: [],
  //     ensBannerImg: ensBannerImg,
  //     bannerText: {
  //       title: this.$t('ens.title'),
  //       subtext: this.$t('ens.dapp-desc')
  //     },
  //     delegatorAddress: ''
  //   };
  // },
  // computed: {
  //   ...mapGetters('global', ['network', 'gasPrice']),
  //   ...mapGetters('external', ['fiatValue']),
  //   ...mapState('wallet', ['balance', 'address', 'web3']),
  //   hasEnsTokenBalance() {
  //     return toBN(this.ensTokens.balance).gt(toBN(0));
  //   },
  //   errorMessages() {
  //     if (this.domainTaken) return this.$t('ens.domain-taken');
  //     return this.searchError;
  //   },
  //   delegatorErrors() {
  //     if (!isAddress(this.delegatorAddress)) {
  //       return 'Invalid address!';
  //     }
  //     return '';
  //   },
  //   isClaimDisabled() {
  //     return (
  //       this.ensTokens.claimed ||
  //       this.delegatorErrors !== '' ||
  //       this.delegatorAddress === ''
  //     );
  //   },
  //   rules() {
  //     return [
  //       this.searchError === '' || this.searchError,
  //       (this.name && this.name.length > 2) ||
  //         this.$t('ens.warning.not-enough-char'),
  //       !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol'),
  //       (this.name && this.name.split('.').length <= 2) ||
  //         this.$t('ens.warning.invalid-symbol')
  //     ];
  //   },
  //   hasInvalidChars() {
  //     const letters = /^[0-9a-zA-Z_.-]+$/;
  //     if (!letters.test(this.name)) {
  //       return true;
  //     }
  //     return false;
  //   },
  //   balanceToWei() {
  //     return this.web3.utils.toWei(BigNumber(this.balance).toString(), 'ether');
  //   },
  //   loading() {
  //     return this.nameHandler.checkingDomainAvail;
  //   },
  //   ensDomainAvailable() {
  //     return this.nameHandler.isAvailable;
  //   },
  //   isNameEmpty() {
  //     return this.name === null || this.name === '';
  //   },
  //   domainTaken() {
  //     return (
  //       !this.isNameEmpty &&
  //       !this.loading &&
  //       !this.ensDomainAvailable &&
  //       Object.keys(this.nameHandler).length !== 0
  //     );
  //   },
  //   totalDomains() {
  //     return formatIntegerToString(this.myDomains.length);
  //   }
  // },
  // watch: {
  //   ensDomainAvailable(newVal) {
  //     if (newVal === true) {
  //       this.onRegister = true;
  //     }
  //   }
  // },
  // mounted() {
  //   const ens = this.network.type.ens
  //     ? new ENS(this.web3.currentProvider, this.network.type.ens.registry)
  //     : null;
  //   this.ensManager = new handlerEnsManager(
  //     this.network,
  //     this.address,
  //     this.web3,
  //     ens,
  //     this.gasPrice
  //   );

  //   this.getDomains();
  //   hasClaimed(this.address, this.web3).then(data => {
  //     this.ensTokens.claimed = data.claimed;
  //     this.ensTokens.balance = data.balance;
  //     this.ensTokens.proof = data.proof;
  //   });
  // },
  // methods: {
  //   claimTokens() {
  //     submitClaim(
  //       this.ensTokens.balance,
  //       this.ensTokens.proof,
  //       this.delegatorAddress,
  //       this.web3
  //     );
  //   },
  //   setDelegatorAddress(address) {
  //     this.delegatorAddress = address;
  //   },
  //   isValidDelegatorAddress(address) {
  //     return isAddress(address);
  //   },
  //   buyDomain() {
  //     this.activeTab = 0;
  //   },
  //   /**
  //    * Manage Domain
  //    */
  //   manage(type, idx) {
  //     this.onManage = true;
  //     this.manageType = type;
  //     this.manageDomainHandler = this.myDomains[idx];
  //   },
  //   getDomains() {
  //     this.ensManager
  //       .getAllNamesForAddress()
  //       .then(res => {
  //         res.forEach(domain => {
  //           domain.hasActiveBorder = !domain.expired;
  //           domain.disabled = domain.expired;
  //           domain.colorTheme = domain.expired
  //             ? 'errorOutlineActive'
  //             : 'superPrimary';
  //           domain.warningBadge = domain.expired
  //             ? {
  //                 color: 'error',
  //                 text: this.$t('ens.expired')
  //               }
  //             : '';
  //         });
  //         this.myDomains = res;
  //       })
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //   },
  //   closeManage() {
  //     this.onManage = false;
  //     this.settingIpfs = false;
  //   },
  //   transfer(address) {
  //     this.manageDomainHandler
  //       .transfer(address)
  //       .then(() => {
  //         setTimeout(() => {
  //           this.getDomains();
  //         }, 15000);
  //       })
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //     this.closeManage();
  //   },
  //   renew(duration) {
  //     this.manageDomainHandler
  //       .renew(duration, this.balanceToWei)
  //       .then(this.getDomains)
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //     this.closeManage();
  //   },
  //   setMulticoin(coin) {
  //     this.manageDomainHandler
  //       .setMulticoin(coin)
  //       .then(this.getDomains)
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //     this.closeManage();
  //   },
  //   setTextRecords(records) {
  //     this.manageDomainHandler
  //       .setTxtRecord(records)
  //       .then(this.getDomains)
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //     this.closeManage();
  //   },
  //   uploadFile(file) {
  //     this.settingIpfs = true;
  //     this.manageDomainHandler
  //       .uploadFile(file)
  //       .then(res => {
  //         this.manageDomainHandler.setIPFSHash(res);
  //       })
  //       .then(resp => {
  //         this.settingIpfs = false;
  //         this.uploadedHash = resp;
  //         this.closeManage();
  //       })
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //   },
  //   setIpfs(hash) {
  //     this.settingIpfs = true;
  //     this.manageDomainHandler
  //       .setIPFSHash(hash)
  //       .then(() => {
  //         this.settingIpfs = false;
  //       })
  //       .catch(err => {
  //         Toast(err, {}, ERROR);
  //       });
  //     this.closeManage();
  //   },
  //   /**
  //    * Register Domain
  //    */
  //   findDomain() {
  //     try {
  //       this.nameHandler = this.ensManager.searchName(this.name);
  //     } catch (e) {
  //       Toast(e, {}, ERROR);
  //     }
  //   },
  //   closeRegister() {
  //     this.onRegister = false;
  //     this.committed = false;
  //     this.loadingCommit = false;
  //     this.name = '';
  //     this.nameHandler = {};
  //     this.$router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
  //   },
  //   setName(name) {
  //     this.searchError = '';
  //     if (this.name === null || this.name === '') {
  //       this.nameHandler = {};
  //     }
  //     try {
  //       this.name = normalise(name);
  //     } catch (e) {
  //       this.searchError = e.message.includes('Failed to validate')
  //         ? 'Invalid name!'
  //         : e.message;
  //       this.name = name;
  //     }
  //   },
  //   register(duration) {
  //     this.nameHandler
  //       .register(duration, this.balanceToWei)
  //       .on('transactionHash', () => {
  //         Toast(`ENS name: ${this.name} registered`, {}, SUCCESS);
  //         this.closeRegister();
  //       })
  //       .once('receipt', () => {
  //         setTimeout(() => {
  //           this.getDomains();
  //         }, 15000);
  //       })
  //       .on('error', err => {
  //         Toast(err, {}, ERROR);
  //       });
  //   },
  //   commit() {
  //     let waitingTime;
  //     this.nameHandler
  //       .createCommitment()
  //       .on('transactionHash', () => {
  //         this.nameHandler.getMinimumAge().then(resp => {
  //           this.minimumAge = resp;
  //           waitingTime = parseInt(resp);
  //         });
  //       })
  //       .on('receipt', () => {
  //         this.loadingCommit = true;
  //         this.committed = false;
  //         setTimeout(() => {
  //           this.committed = true;
  //           this.loadingCommit = false;
  //         }, waitingTime * 1000);
  //       })
  //       .on('error', err => {
  //         this.closeRegister();
  //         Toast(err, {}, ERROR);
  //       });
  //   },
  //   generateKeyPhrase() {
  //     if (this.nameHandler.generateKeyPhrase) {
  //       this.nameHandler.generateKeyPhrase();
  //     }
  //   },
  //   getRentPrice(duration) {
  //     const handler = this.onManage
  //       ? this.manageDomainHandler
  //       : this.nameHandler;
  //     return handler.getRentPrice(duration).then(resp => {
  //       if (resp) {
  //         const ethValue = fromWei(resp);
  //         return {
  //           wei: resp,
  //           eth: ethValue,
  //           usd: new BigNumber(ethValue).times(this.fiatValue).toFixed(2)
  //         };
  //       }
  //     });
  //   }
  // }
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
