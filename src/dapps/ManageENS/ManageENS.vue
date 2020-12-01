<template>
  <div class="manage-ens-container">
    <div class="ens-header">
      <back-button>
        <template v-if="headerContext" v-slot:center>
          <div class="button-container">
            <b-button
              :class="[
                'action-btn',
                $route.name === 'ensInitialState' ? 'active-btn' : ''
              ]"
              @click="
                () => {
                  navigateHeaderButtons('register');
                }
              "
            >
              {{ $t('ens.register-domain') }}
            </b-button>
            <b-button
              :class="[
                'action-btn',
                $route.name === 'ensMultiManager' ? 'active-btn' : ''
              ]"
              @click="
                () => {
                  navigateHeaderButtons('manager');
                }
              "
            >
              {{ $t('ens.manage-domain') }}
            </b-button>
          </div>
        </template>
      </back-button>
    </div>
    <router-view
      :contract-initiated="contractInitiated"
      :check-domain="checkDomain"
      :secret-phrase="secretPhrase"
      :host-name="parsedHostName"
      :domain-name="parsedDomainName"
      :loading="loading"
      :name-hash="nameHash"
      :label-hash="labelHash"
      :owner="owner"
      :raw="raw"
      :step="step"
      :domain-name-err="domainNameErr"
      :generate-key-phrase="generateKeyPhrase"
      :set-multi-coin="setMultiCoin"
      :transfer-domain="transferDomain"
      :tld="parsedTld === '' ? registrarTLD : parsedTld"
      :network-name="network.type.name"
      :register-fifs-name="registerFifsName"
      :multi-tld="multiTld"
      :claim-func="claimFunc"
      :dns-owner="dnsOwner"
      :dns-claim="dnsClaim"
      :create-commitment="createCommitment"
      :register-with-duration="registerWithDuration"
      :minimum-age="minimumAge"
      :commitment-created="commitmentCreated"
      :resolver-multi-coin-support="resolverMultiCoinSupport"
      :resolver-txt-support="resolverTxtSupport"
      :supported-coins="supportedCoins"
      :txt-records="txtRecords"
      :set-record="setRecord"
      :usd="usd"
      :is-sub-domain="isSubDomain"
      :is-controller="isController"
      :set-controller="setController"
      :has-deed="hasDeed"
      :is-deed-owner="isDeedOwner"
      :is-expired="isExpired"
      :renew-name="renewName"
      :release-deed="releaseDeed"
      :navigate-to-renew="navigateToRenew"
      :deed-value="deedValue"
      :get-controller="getController"
      :content-hash="contentHash"
      :upload-file="uploadFile"
      :save-content-hash="saveContentHash"
      :ipfs-processing="ipfsProcessing"
      @updateSecretPhrase="updateSecretPhrase"
      @domainNameChange="updateDomainName"
      @updateStep="updateStep"
      @updateDuration="updateDuration"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import PermanentRegistrarControllerAbi from './ABI/permanentRegistrarController';
import baseRegistrarAbi from './ABI/baseRegistrarAbi';
import RegistryAbi from './ABI/registryAbi.js';
import FifsRegistrarAbi from './ABI/fifsRegistrarAbi.js';
import ResolverAbi from './ABI/resolverAbi.js';
import OldEnsAbi from './ABI/oldEnsAbi.js';
import OldDeedAbi from './ABI/oldDeedAbi.js';
import * as unit from 'ethjs-unit';
import * as nameHashPckg from 'eth-ens-namehash';
import normalise from '@/helpers/normalise';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import DNSRegistrar from '@ensdomains/dnsregistrar';
import BigNumber from 'bignumber.js';
import supportedCoins from './supportedCoins';
import supportedTxt from './supportedTxt';
import contentHash from 'content-hash';

const bip39 = require('bip39');

const permanentRegistrar = {
  INTERFACE_CONTROLLER: '0x018fac06',
  INTERFACE_LEGACY_REGISTRAR: '0x7ba18ba1'
};

const OLD_ENS_ADDRESS = '0x6090a6e47849629b7245dfa1ca21d94cd15878ef';
const MULTICOIN_SUPPORT_INTERFACE = '0xf1cb7e06';
const TEXT_RECORD_SUPPORT_INTERFACE = '0x59d1d43c';
const REGISTRAR_TYPES = {
  FIFS: 'fifs',
  PERMANENT: 'permanent'
};
export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return {
      domainName: '',
      loading: false,
      nameHash: '',
      labelHash: '',
      owner: '',
      secretPhrase: '',
      registrarAddress: '',
      raw: {},
      contractInitiated: false,
      step: 1,
      domainNameErr: false,
      ensRegistryContract: {},
      dnsRegistrar: {},
      dnsClaim: {},
      dnsOwner: '',
      minimumAge: 0,
      duration: 1,
      commitmentCreated: false,
      publicResolverAddress: '',
      resolverMultiCoinSupport: false,
      supportedCoins,
      txtRecords: {},
      supportedTxt,
      recordContract: {},
      resolverTxtSupport: false,
      usd: 0,
      isController: false,
      hasDeed: false,
      isDeedOwner: false,
      isExpired: false,
      deedValue: '0',
      controllerAddress: '',
      contractControllerAddress: '',
      contentHash: '',
      ipfsProcessing: false,
      registrarControllerContract: {}
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account', 'gasPrice', 'ens']),
    registrarTLD() {
      if (!this.network.type || !this.network.type.ens) {
        return '';
      }
      return this.network.type.ens.registrarTLD;
    },
    headerContext() {
      return (
        this.$route.fullPath === '/interface/dapps/manage-ens' ||
        this.$route.fullPath === '/interface/dapps/manage-ens/' ||
        this.$route.fullPath === '/interface/dapps/manage-ens/manager'
      );
    },
    registrarType() {
      return this.network.type.ens.registrarType;
    },
    multiTld() {
      return (
        this.network.type.ens.hasOwnProperty('supportedTld') &&
        this.network.type.ens.supportedTld.length > 1
      );
    },
    parsedTld() {
      if (this.parsedHostName && this.parsedHostName.length) {
        const hasTld = this.domainName.lastIndexOf('.');
        return hasTld > -1
          ? this.domainName.substr(hasTld + 1, this.domainName.length)
          : this.registrarTLD;
      }
      return '';
    },
    parsedHostName() {
      if (this.domainName && this.domainName.length) {
        return this.domainName.substr(
          0,
          this.domainName.lastIndexOf('.') > -1
            ? this.domainName.lastIndexOf('.')
            : this.domainName.length
        );
      }
      return '';
    },
    parsedDomainName() {
      return this.parsedHostName + '.' + this.parsedTld;
    },
    isSubDomain() {
      return this.domainName.split('.').length - 1 > 1;
    }
  },
  watch: {
    ens(newVal) {
      if (newVal) {
        this.setRegistrar();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
    });

    this.fetchUsd();
  },
  methods: {
    async fetchUsd() {
      const url = 'https://cryptorates.mewapi.io/ticker?filter=ETH';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      this.usd = values.data.ETH.quotes.USD.price;
    },
    async setup() {
      this.isPermanentLive = true;
      this.domainName = '';
      this.loading = false;
      this.nameHash = '';
      this.labelHash = '';
      this.owner = '';
      this.secretPhrase = '';
      this.registrarAddress = '';
      this.raw = {};
      this.contractInitiated = false;
      this.step = 1;
      this.contractInitiated = false;
      this.contractInitiated = true;
      this.domainNameErr = false;
      this.dnsRegistrar = {};
      this.dnsClaim = {};
      this.minimumAge = 0;
      this.duration = 1;
      this.commitmentCreated = false;
      this.publicResolverAddress = '';
      this.resolverMultiCoinSupport = false;
      this.resolverTxtSupport = false;
      this.supportedCoins = supportedCoins;
      this.txtRecords = {};
      this.recordContract = {};
      this.hasDeed = false;
      this.isDeedOwner = false;
      this.isExpired = false;
      this.deedValue = '0';
      this.controllerAddress = '';
      this.contractControllerAddress = '';
      this.contentHash = '';
      this.ipfsProcessing = false;

      if (this.ens) {
        this.setRegistrar();
      }
      for (const type in this.supportedCoins)
        this.supportedCoins[type].value = '';
    },
    async checkIfController() {
      // checks the controller for the name
      const owner = await this.ensRegistryContract.methods
        .owner(this.nameHash)
        .call();
      this.controllerAddress = owner;
      this.isController =
        this.web3.utils.toChecksumAddress(owner) ===
        this.web3.utils.toChecksumAddress(this.account.address);
    },
    async getController(name) {
      const nameHash = nameHashPckg.hash(`${name}.eth`);
      const owner = await this.ensRegistryContract.methods
        .owner(nameHash)
        .call();
      return owner;
    },
    async checkDeed() {
      const contract = new this.web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
      const entries = await contract.methods.entries(this.labelHash).call();
      if (entries[1] !== '0x0000000000000000000000000000000000000000') {
        this.hasDeed = true;
        const deedContract = new this.web3.eth.Contract(OldDeedAbi, entries[1]);
        const owner = await deedContract.methods.owner().call();
        this.isDeedOwner =
          this.web3.utils.toChecksumAddress(owner) ===
          this.web3.utils.toChecksumAddress(this.account.address);
        this.deedValue = await deedContract.methods.value().call();
      } else {
        this.hasDeed = false;
        this.isDeedOwner = false;
      }
    },
    navigateHeaderButtons(to) {
      this.$router.push({
        name: to === 'register' ? 'ensInitialState' : 'ensMultiManager'
      });
    },
    navigateToRenew() {
      this.$router.push({ name: 'ensRenewName' });
    },
    async renewName(name) {
      const domainName = name ? name : this.parsedDomainName;
      const hostName = name
        ? name.replace(`.${this.network.type.ens.registrarTLD}`, '')
        : this.parsedHostName;

      const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
      const duration = Math.ceil(SECONDS_YEAR * this.duration);
      try {
        const rentPrice = await this.registrarControllerContract.methods
          .rentPrice(domainName, duration)
          .call();
        const checkBalance = new BigNumber(rentPrice).gte(this.account.balance);
        if (checkBalance) {
          Toast.responseHandler(
            this.$t('ens.error.balance-too-low'),
            Toast.WARN
          );
        } else {
          const data = this.registrarControllerContract.methods
            .renew(hostName, duration)
            .encodeABI();
          const withFivePercent = BigNumber(rentPrice)
            .times(1.05)
            .integerValue()
            .toFixed();
          const txObj = {
            to: this.contractControllerAddress,
            from: this.account.address,
            data: data,
            value: withFivePercent
          };
          this.web3.eth
            .sendTransaction(txObj)
            .then(() => {
              Toast.responseHandler(
                this.$t('ens.toast.success'),
                Toast.SUCCESS
              );
            })
            .catch(err => {
              Toast.responseHandler(err, false);
            });
        }
      } catch (e) {
        this.loading = false;
        const toastText = this.$t('ens.error.something-went-wrong');
        Toast.responseHandler(toastText, Toast.ERROR);
      }
    },
    async releaseDeed() {
      if (this.hasDeed && this.isDeedOwner) {
        const contract = new this.web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
        const obj = {
          from: this.account.address,
          to: OLD_ENS_ADDRESS,
          data: contract.methods.releaseDeed(this.labelHash).encodeABI(),
          value: 0
        };
        this.web3.eth.sendTransaction(obj).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      } else {
        Toast.responseHandler(this.$t('ens.error.not-the-owner'), Toast.ERROR);
      }
    },
    async setRegistrar() {
      const web3 = this.web3;
      const tld = this.registrarTLD;
      this.registrarAddress = await this.getRegistrarAddress(tld);
      this.ensRegistryContract = new web3.eth.Contract(
        RegistryAbi,
        this.network.type.ens.registry
      );
      if (this.registrarType === REGISTRAR_TYPES.FIFS) {
        this.registrarContract = new web3.eth.Contract(
          FifsRegistrarAbi,
          this.registrarAddress
        );
      } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
        try {
          this.contractControllerAddress = await this.ens
            .resolver(this.registrarTLD, ResolverAbi)
            .interfaceImplementer(permanentRegistrar.INTERFACE_CONTROLLER);
          this.registrarControllerContract = new this.web3.eth.Contract(
            PermanentRegistrarControllerAbi,
            this.contractControllerAddress
          );
          this.registrarContract = new this.web3.eth.Contract(
            baseRegistrarAbi,
            this.registrarAddress
          );
        } catch (e) {
          this.isPermanentLive = false;
          const toastText = this.$t('ens.error.permanent-not-available');
          Toast.responseHandler(toastText, Toast.ERROR);
        }
      }
    },
    setController(toAddress = '', onlyGenerate = false) {
      const actualToAddress =
        toAddress === '' ? this.account.address : toAddress;
      const setControllerTx = {
        from: this.account.address,
        to: this.registrarAddress,
        data: this.registrarContract.methods
          .reclaim(this.labelHash, actualToAddress)
          .encodeABI(),
        value: 0
      };

      if (onlyGenerate) {
        return setControllerTx;
      }
      this.web3.eth.sendTransaction(setControllerTx).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    transferDomain(toAddress) {
      if (this.registrarType === REGISTRAR_TYPES.FIFS || this.isSubDomain) {
        this.web3.eth
          .sendTransaction({
            from: this.account.address,
            to: this.network.type.ens.registry,
            data: this.ensRegistryContract.methods
              .setOwner(this.nameHash, toAddress)
              .encodeABI(),
            value: 0
          })
          .catch(err => {
            Toast.responseHandler(err, false);
          });
      } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
        const registryTransferTx = this.setController(toAddress, true);
        const safeTransferTx = {
          from: this.account.address,
          to: this.registrarAddress,
          data: this.registrarContract.methods
            .transferFrom(this.account.address, toAddress, this.labelHash)
            .encodeABI(),
          value: 0
        };
        this.web3.mew.sendBatchTransactions(
          [registryTransferTx, safeTransferTx].filter(Boolean)
        );
      }
    },
    getDecodedAddress(_coinItem) {
      let decodedAddress = '0x';
      if (_coinItem.value !== '' && _coinItem.value) {
        decodedAddress = _coinItem.decode(_coinItem.value);
      }
      return decodedAddress;
    },
    async resolverMigrateAndSet() {
      const web3 = this.web3;
      const address = this.account.address;
      const publicResolverAddress = this.publicResolverAddress;
      const currentResolverAddress = await this.ensRegistryContract.methods
        .resolver(this.nameHash)
        .call();
      if (
        publicResolverAddress.toLowerCase() ===
        currentResolverAddress.toLowerCase()
      )
        return false;
      const publicResolverContract = new web3.eth.Contract(
        ResolverAbi,
        publicResolverAddress
      );
      const setResolverTx = {
        from: address,
        to: this.network.type.ens.registry,
        data: this.ensRegistryContract.methods
          .setResolver(this.nameHash, publicResolverAddress)
          .encodeABI(),
        value: 0,
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
      };
      const multiCallRecords = [];
      for (const coin in this.supportedCoins) {
        if (this.supportedCoins[coin].value) {
          multiCallRecords.push(
            publicResolverContract.methods
              .setAddr(
                this.nameHash,
                this.supportedCoins[coin].id,
                this.getDecodedAddress(this.supportedCoins[coin])
              )
              .encodeABI()
          );
        }
      }
      for (const txt in this.txtRecords) {
        if (this.txtRecords[txt]) {
          multiCallRecords.push(
            this.recordContract.methods
              .setText(this.nameHash, txt, this.txtRecords[txt])
              .encodeABI()
          );
        }
      }
      const migrateRecordsTx = {
        from: address,
        to: publicResolverAddress,
        data: publicResolverContract.methods
          .multicall(multiCallRecords)
          .encodeABI(),
        value: 0,
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
      };
      web3.mew.sendBatchTransactions(
        [migrateRecordsTx, setResolverTx].filter(Boolean)
      );
      return true;
    },
    async setMultiCoin(coin) {
      coin.forEach(_coin => {
        this.supportedCoins[_coin.symbol].value = _coin.value;
      });
      const isMigrate = await this.resolverMigrateAndSet();
      if (isMigrate) return;
      const web3 = this.web3;
      const address = this.account.address;
      const publicResolverAddress = this.publicResolverAddress;
      const publicResolverContract = new web3.eth.Contract(
        ResolverAbi,
        publicResolverAddress
      );
      const arr = coin.map(item => {
        return publicResolverContract.methods
          .setAddr(this.nameHash, item.id, this.getDecodedAddress(item))
          .encodeABI();
      });
      const setAddrTx = {
        from: address,
        to: publicResolverAddress,
        data: publicResolverContract.methods.multicall(arr).encodeABI(),
        value: 0,
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed(),
        gas: 100000
      };
      web3.eth.sendTransaction(setAddrTx).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    async registerFifsName() {
      const address = this.account.address;
      const web3 = this.web3;
      const data = await this.registrarContract.methods
        .register(this.labelHash, address)
        .encodeABI();
      const registerTx = {
        from: address,
        value: 0,
        to: this.registrarAddress,
        data: data
      };
      const setResolverTx = {
        from: address,
        to: this.network.type.ens.registry,
        data: this.ensRegistryContract.methods
          .setResolver(this.nameHash, this.publicResolverAddress)
          .encodeABI(),
        value: 0,
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
      };
      web3.mew
        .sendBatchTransactions([registerTx, setResolverTx].filter(Boolean))
        .catch(err => {
          Toast.responseHandler(err, false);
        });
    },
    async getRegistrarAddress(tld) {
      const registrarAddress = await this.ens.owner(tld);
      return registrarAddress;
    },
    async checkDomain(domainName, bool) {
      if (domainName !== '' && domainName && typeof domainName === 'string')
        this.domainName = domainName;
      const supportedTlds = this.network.type.ens.supportedTld;
      const isSupported = supportedTlds.find(item => {
        return item === this.parsedTld;
      });
      this.loading = true;
      const web3 = this.web3;
      this.labelHash = web3.utils.sha3(this.parsedHostName);
      this.nameHash = nameHashPckg.hash(this.parsedDomainName);
      const resolver = await this.ens.resolver('resolver.eth');
      this.publicResolverAddress = await resolver.addr();

      if (this.parsedTld !== '' && isSupported === undefined) {
        const toastText = this.$t('ens.error.domain-tld-not-supported', {
          parsedTld: this.parsedTld
        });
        Toast.responseHandler(toastText, Toast.ERROR);
        this.loading = false;
      } else if (this.parsedTld === this.registrarTLD) {
        try {
          if (
            this.registrarType === REGISTRAR_TYPES.FIFS &&
            !this.isSubDomain
          ) {
            const expiryTime = await this.registrarContract.methods
              .expiryTimes(this.labelHash)
              .call();
            const isAvailable = expiryTime * 1000 < new Date().getTime();
            if (isAvailable) {
              this.$router.push({ name: 'fifsReserve' });
              this.loading = false;
            } else {
              this.getMoreInfo();
              this.loading = false;
            }
          } else if (
            this.registrarType === REGISTRAR_TYPES.PERMANENT &&
            !this.isSubDomain
          ) {
            if (!this.isPermanentLive) {
              const toastText = this.$t('ens.error.permanent-not-available');
              Toast.responseHandler(toastText, Toast.ERROR);
              return;
            }
            const isAvailable = await this.registrarControllerContract.methods
              .available(this.parsedHostName)
              .call();
            if (!isAvailable) {
              this.getMoreInfo(bool);
            } else {
              this.generateKeyPhrase();
              this.$router.push({ name: 'ensCreateCommitment' });
              this.loading = false;
            }
          } else if (this.isSubDomain) {
            const owner = await this.ens.owner(this.parsedDomainName);
            if (owner === '0x0000000000000000000000000000000000000000') {
              Toast.responseHandler(
                this.$t('ens.warning.subdomain-is-not-owned'),
                Toast.WARN
              );
            } else {
              this.getMoreInfo();
            }
          }
        } catch (e) {
          Toast.responseHandler(e, false);
          this.loading = false;
        }
      } else {
        try {
          const registrarAddr = await this.ens.owner(this.parsedTld);
          this.dnsRegistrar = new DNSRegistrar(
            this.web3.currentProvider,
            registrarAddr
          );
          this.dnsClaim = await this.dnsRegistrar.claim(this.parsedDomainName);
          const _owner = await this.ens.owner(this.parsedDomainName);
          const isInNewRegistry = await this.ensRegistryContract.methods
            .recordExists(nameHashPckg.hash(this.parsedDomainName))
            .call();
          if (this.dnsClaim.result.found && !isInNewRegistry) {
            this.dnsOwner = this.dnsClaim.getOwner();
            this.processDNSresult('dnsClaimable'); // reclaim in new registry
          } else if (
            this.dnsClaim.result.found &&
            this.dnsClaim.getOwner().toLowerCase() === _owner.toLowerCase()
          ) {
            this.getMoreInfo();
          } else if (this.dnsClaim.result.found) {
            this.dnsOwner = this.dnsClaim.getOwner();
            this.processDNSresult('dnsClaimable'); // Claimable
          } else if (this.dnsClaim.result.nsec) {
            this.owner = _owner;
            this.processDNSresult('dnsMissingTXT'); // TXT missing/unclaim
          } else {
            this.processDNSresult('dnsNotSetup'); // DNSEC not setup properly
          }
        } catch (e) {
          this.loading = false;
          const toastText = this.$t('ens.error.something-went-wrong');
          Toast.responseHandler(toastText, Toast.ERROR);
        }
      }
    },
    async createCommitment() {
      const utils = this.web3.utils;
      try {
        const commitment = await this.registrarControllerContract.methods
          .makeCommitmentWithConfig(
            this.parsedHostName,
            this.account.address,
            utils.sha3(this.secretPhrase),
            this.publicResolverAddress,
            this.account.address
          )
          .call();
        this.minimumAge = await this.registrarControllerContract.methods
          .minCommitmentAge()
          .call();
        this.minimumAge = `${parseInt(this.minimumAge) + 30}`;
        await this.registrarControllerContract.methods
          .commit(commitment)
          .send({ from: this.account.address })
          .once('transactionHash', () => {
            this.$router.push({ name: 'ensPermRegistration' });
          })
          .on('receipt', () => {
            this.loading = false;
            this.commitmentCreated = true;
          });
      } catch (e) {
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async registerWithDuration() {
      const utils = this.web3.utils;
      this.loading = true;
      const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
      const duration = Math.ceil(SECONDS_YEAR * this.duration);
      try {
        const toastRecieptText = this.$t('ens.toast.success-register');
        const rentPrice = await this.registrarControllerContract.methods
          .rentPrice(this.parsedHostName, duration)
          .call();
        const withFivePercent = BigNumber(rentPrice)
          .times(1.05)
          .integerValue()
          .toFixed();

        this.registrarControllerContract.methods
          .registerWithConfig(
            this.parsedHostName,
            this.account.address,
            duration,
            utils.sha3(this.secretPhrase),
            this.publicResolverAddress,
            this.account.address
          )
          .send({ from: this.account.address, value: withFivePercent })
          .once('transactionHash', () => {
            this.$router.push({ name: 'ensPermRegistrationOngoing' });
          })
          .once('receipt', () => {
            this.getMoreInfo();
            Toast.responseHandler(toastRecieptText, Toast.SUCCESS);
          });
      } catch (e) {
        this.loading = false;
        const toastText = this.$t('ens.error.something-went-wrong');
        Toast.responseHandler(toastText, Toast.ERROR);
      }
    },
    async claimFunc() {
      this.loading = true;
      try {
        await this.dnsClaim.submit({
          from: this.account.address
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        const toastText = this.$t('ens.error.something-went-wrong');
        Toast.responseHandler(toastText, Toast.ERROR);
      }
    },
    updateStep(val) {
      this.step = val;
    },
    processDNSresult(type) {
      this.loading = false;
      switch (type) {
        case 'dnsClaimable':
          this.$router.push({ name: 'dnsClaim' });
          break;
        case 'dnsNotSetup':
          this.$router.push({ name: 'dnsError' });
          break;
        case 'dnsMissingTXT':
          this.$router.push({ name: 'dnsNoTxt' });
          break;
      }
    },
    updateDomainName(value) {
      try {
        this.domainName = normalise(value);
      } catch (e) {
        Toast.responseHandler(e, Toast.WARN);
        this.domainNameErr = true;
        return;
      }
      if (this.parsedTld === this.registrarTLD) {
        this.domainNameErr =
          value.substr(0, 2) === '0x' || this.parsedHostName.length < 3;
      } else {
        this.domainNameErr = false;
      }
    },
    async uploadFile(file) {
      const formData = new FormData();

      this.ipfsProcessing = true;
      try {
        const content = await fetch('https://swap.mewapi.io/ipfs', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            method: 'getUploadUrl'
          })
        }).then(response => {
          return response.json();
        });
        for (const key in content.body.fields) {
          formData.append(key, content.body.fields[key]);
        }
        formData.append('file', file);
        fetch(content.body.signedUrl, {
          method: 'POST',
          headers: {
            'Content-Length': file.size
          },
          body: formData
        }).then(response => {
          if (!response.ok) {
            this.ipfsProcessing = false;
            Toast.responseHandler(
              this.$t('ens.error.file-upload-error'),
              Toast.ERROR
            );
            return;
          }
          this.getHashFromFile(content.body.hashResponse);
        });
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async getHashFromFile(hash) {
      try {
        const ipfsHash = await fetch('https://swap.mewapi.io/ipfs', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            method: 'uploadComplete',
            hash: hash
          })
        })
          .then(response => {
            return response.json();
          })
          .catch(e => {
            this.ipfsProcessing = false;
            Toast.responseHandler(e, Toast.ERROR);
          });
        if (ipfsHash.error) {
          Toast.responseHandler(
            this.$t('ens.error.error-getting-ipfs-hash'),
            Toast.ERROR
          );
        } else {
          this.saveContentHash(ipfsHash);
        }
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async saveContentHash(ipfsHash) {
      const ipfsToHash = `0x${contentHash.fromIpfs(ipfsHash)}`;
      const currentResolverAddress = await this.ensRegistryContract.methods
        .resolver(this.nameHash)
        .call();
      const resolverContract = new this.web3.eth.Contract(
        ResolverAbi,
        currentResolverAddress
      );

      try {
        const txObj = {
          from: this.account.address,
          to: currentResolverAddress,
          data: resolverContract.methods
            .setContenthash(this.nameHash, ipfsToHash)
            .encodeABI(),
          value: 0
        };

        this.web3.eth.sendTransaction(txObj).then(() => {
          this.contentHash = ipfsHash;
          this.ipfsProcessing = false;
        });
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async getMoreInfo(renew) {
      let owner;
      try {
        if (
          this.registrarType === REGISTRAR_TYPES.PERMANENT &&
          this.parsedTld === this.registrarTLD &&
          !this.isSubDomain
        ) {
          const expiryTime = await this.registrarContract.methods
            .nameExpires(this.labelHash)
            .call();
          this.isExpired = expiryTime * 1000 < new Date().getTime();
          try {
            owner = await this.registrarContract.methods
              .ownerOf(this.labelHash)
              .call();
          } catch (e) {
            const response = await fetch(
              `https://nft2.mewapi.io/tokens?owner=${this.account.address}&chain=mainnet`
            ).then(res => {
              return res.json();
            });
            const tokens = response.hasOwnProperty(
              this.registrarAddress.toLowerCase()
            )
              ? response[this.registrarAddress.toLowerCase()].tokens
              : [];
            const nameMatched = tokens.find(item => {
              if (
                item.name === this.parsedHostName ||
                item.id === this.labelHash
              )
                return item;
            });

            if (nameMatched) {
              owner = this.account.address;
            } else {
              owner = '0x';
            }
          }
          this.checkDeed();
        } else {
          owner = await this.ens.owner(this.parsedDomainName);
        }
      } catch (e) {
        owner = '0x';
        Toast.responseHandler(e, false);
      }
      try {
        const publicResolverContract = new this.web3.eth.Contract(
          ResolverAbi,
          this.publicResolverAddress
        );
        this.resolverMultiCoinSupport = await publicResolverContract.methods
          .supportsInterface(MULTICOIN_SUPPORT_INTERFACE)
          .call();
      } catch (e) {
        this.resolverMultiCoinSupport = false;
      }
      try {
        const currentResolverAddress = await this.ensRegistryContract.methods
          .resolver(this.nameHash)
          .call();
        const resolverContract = new this.web3.eth.Contract(
          ResolverAbi,
          currentResolverAddress
        );
        this.checkContentHash(resolverContract);
        this.fetchTxtRecords(resolverContract);
        const supportMultiCoin = await resolverContract.methods
          .supportsInterface(MULTICOIN_SUPPORT_INTERFACE)
          .call();
        for (const type in this.supportedCoins)
          this.supportedCoins[type].value = '';
        if (supportMultiCoin) {
          const promises = [];
          const coinTypes = Object.keys(this.supportedCoins);
          coinTypes.forEach(type => {
            promises.push(
              this.ens
                .resolver(this.parsedDomainName, ResolverAbi)
                .addr(this.supportedCoins[type].id)
            );
          });
          await Promise.all(promises).then(vals => {
            vals.forEach((address, idx) => {
              if (address) {
                this.supportedCoins[coinTypes[idx]].value = this.supportedCoins[
                  coinTypes[idx]
                ].encode(new Buffer(address.replace('0x', ''), 'hex'));
              }
            });
          });
        } else {
          this.supportedCoins.ETH.value = await this.ens
            .resolver(this.parsedDomainName)
            .addr();
        }
      } catch (e) {
        this.supportedCoins.ETH.value = '0x';
      }
      this.owner = owner;
      if (renew) {
        this.$router.push({ name: 'ensRenewName' });
      } else {
        this.$router.push({ name: 'ensNameOwned' });
      }
      this.loading = false;
    },
    async checkContentHash(resolverContract) {
      try {
        const hash = await resolverContract.methods
          .contenthash(this.nameHash)
          .call();
        this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async fetchTxtRecords(resolver) {
      this.checkIfController();
      try {
        const supportsTxt = await resolver.methods
          .supportsInterface(TEXT_RECORD_SUPPORT_INTERFACE)
          .call();
        this.resolverTxtSupport = supportsTxt;
        if (supportsTxt) {
          this.recordContract = resolver;
          const promises = [];
          this.supportedTxt.forEach(txt => {
            promises.push(
              resolver.methods.text(this.nameHash, txt.name).call()
            );
          });
          Promise.all(promises).then(vals => {
            vals.forEach((val, idx) => {
              this.txtRecords[this.supportedTxt[idx].name] = val;
            });
          });
        } else {
          throw new Error(this.$t('ens.error.txt-not-supported'));
        }
      } catch (e) {
        this.recordContract = {};
        this.txtRecords = {};
        this.resolverTxtSupport = false;
      }
    },
    async setRecord(obj) {
      for (const _record in obj) {
        this.txtRecords[_record] = obj[_record];
      }
      const isMigrate = await this.resolverMigrateAndSet();
      if (isMigrate) return;
      const address = this.account.address;
      const resolverAddr = this.publicResolverAddress;
      const contract = this.recordContract;
      const multicalls = [];
      for (const i in obj) {
        multicalls.push(
          contract.methods
            .setText(this.nameHash, i.toLowerCase(), obj[i])
            .encodeABI()
        );
      }

      const tx = {
        from: address,
        to: resolverAddr,
        data: contract.methods.multicall(multicalls).encodeABI(),
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed(),
        value: 0
      };
      this.web3.eth.sendTransaction(tx).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    updateSecretPhrase(e) {
      this.secretPhrase = e;
    },
    updateDuration(e) {
      this.duration = e;
    },
    generateKeyPhrase() {
      const wordsArray = [];
      const min = 0;
      const max = bip39.wordlists.EN.length;

      for (let i = 0; i < 3; i++) {
        wordsArray.push(
          bip39.wordlists.EN[Math.floor(Math.random() * (max - min + 1)) + min]
        );
      }

      this.secretPhrase = wordsArray.join(' ');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageENS.scss';
</style>
