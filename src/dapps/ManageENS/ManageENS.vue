<template>
  <div class="manage-ens-container">
    <back-button />
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
      :deed-owner="deedOwner"
      :raw="raw"
      :step="step"
      :domain-name-err="domainNameErr"
      :generate-key-phrase="generateKeyPhrase"
      :set-multi-coin="setMultiCoin"
      :transfer-domain="transferDomain"
      :tld="parsedTld === '' ? network.type.ens.registrarTLD : parsedTld"
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
import * as unit from 'ethjs-unit';
import * as nameHashPckg from 'eth-ens-namehash';
import normalise from '@/helpers/normalise';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import DNSRegistrar from '@ensdomains/dnsregistrar';
import BigNumber from 'bignumber.js';
import supportedCoins from './supportedCoins';
import supportedTxt from './supportedTxt';

const bip39 = require('bip39');

const permanentRegistrar = {
  INTERFACE_CONTROLLER: '0x018fac06',
  INTERFACE_LEGACY_REGISTRAR: '0x7ba18ba1'
};
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
      deedOwner: '',
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
      resolverTxtSupport: false
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account', 'gasPrice', 'ens']),
    registrarTLD() {
      return this.network.type.ens.registrarTLD;
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
      if (this.parsedHostName.length) {
        const hasTld = this.domainName.lastIndexOf('.');
        return hasTld > -1
          ? this.domainName.substr(hasTld + 1, this.domainName.length)
          : this.registrarTLD;
      }
      return '';
    },
    parsedHostName() {
      return this.domainName.substr(
        0,
        this.domainName.lastIndexOf('.') > -1
          ? this.domainName.lastIndexOf('.')
          : this.domainName.length
      );
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
  },
  methods: {
    async setup() {
      this.isPermanentLive = true;
      this.domainName = '';
      this.loading = false;
      this.nameHash = '';
      this.labelHash = '';
      this.owner = '';
      this.deedOwner = '';
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

      if (this.ens) {
        this.setRegistrar();
      }
      for (const type in this.supportedCoins)
        this.supportedCoins[type].value = '';
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
          const controllerAddress = await this.ens
            .resolver(this.registrarTLD, ResolverAbi)
            .interfaceImplementer(permanentRegistrar.INTERFACE_CONTROLLER);

          this.registrarControllerContract = new this.web3.eth.Contract(
            PermanentRegistrarControllerAbi,
            controllerAddress
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
    async transferDomain(toAddress) {
      let to, data;
      if (this.registrarType === REGISTRAR_TYPES.FIFS) {
        data = this.ensRegistryContract.methods
          .setOwner(this.nameHash, toAddress)
          .encodeABI();
        to = this.network.type.ens.registry;
      } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
        data = this.registrarContract.methods
          .safeTransferFrom(this.account.address, toAddress, this.labelHash)
          .encodeABI();
        to = this.registrarAddress;
      }
      const transferTx = {
        from: this.account.address,
        to,
        data,
        value: 0,
        gas: 100000
      };
      this.web3.eth.sendTransaction(transferTx).catch(err => {
        Toast.responseHandler(err, false);
      });
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
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
      };
      web3.eth.sendTransaction(setAddrTx).catch(err => {
        Toast.responseHandler(err, false);
      });
    },
    async registerFifsName() {
      const address = this.account.address;
      const web3 = this.web3;
      const data = await this.registrarContract.methods
        .register(this.labelHash, address)
        .encodeABI();
      const raw = {
        from: address,
        value: 0,
        to: this.registrarAddress,
        data: data
      };
      web3.eth.sendTransaction(raw).catch(err => {
        Toast.responseHandler(err, false);
      });
    },
    async getRegistrarAddress(tld) {
      const registrarAddress = await this.ens.owner(tld);
      return registrarAddress;
    },
    async checkDomain() {
      const supportedTlds = this.network.type.ens.supportedTld;
      const isSupported = supportedTlds.find(item => {
        return item === this.parsedTld;
      });
      this.loading = true;
      const web3 = this.web3;
      this.labelHash = web3.utils.sha3(this.parsedHostName);
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
              this.$router.push({ path: 'manage-ens/fifs' });
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
            if (!isAvailable) this.getMoreInfo();
            else {
              this.generateKeyPhrase();
              this.$router.push({ path: 'manage-ens/create-commitment' });
              this.loading = false;
            }
          } else if (this.isSubDomain) {
            const owner = await this.ens.owner(this.parsedDomainName);
            if (owner === '0x0000000000000000000000000000000000000000') {
              Toast.responseHandler('This subdomain is not owned', Toast.WARN);
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
            this.$router.push({ path: 'permanent-registration' });
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
        this.registrarControllerContract.methods
          .registerWithConfig(
            this.parsedHostName,
            this.account.address,
            duration,
            utils.sha3(this.secretPhrase),
            this.publicResolverAddress,
            this.account.address
          )
          .send({ from: this.account.address, value: rentPrice })
          .once('transactionHash', () => {
            this.$router.push({ path: 'registration-in-progress' });
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
        case 'dnsOwned':
          this.$router.push({ path: 'manage-ens/dns-owned' });
          break;
        case 'dnsClaimable':
          this.$router.push({ path: 'manage-ens/claim' });
          break;
        case 'dnsNotSetup':
          this.$router.push({ path: 'manage-ens/dns-error' });
          break;
        case 'dnsMissingTXT':
          this.$router.push({ path: 'manage-ens/no-txt-setup' });
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
    async getMoreInfo() {
      let owner;
      this.nameHash = nameHashPckg.hash(this.parsedDomainName);
      try {
        if (
          this.registrarType === REGISTRAR_TYPES.PERMANENT &&
          this.parsedTld === this.registrarTLD &&
          !this.isSubDomain
        ) {
          owner = await this.registrarContract.methods
            .ownerOf(this.labelHash)
            .call();
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
      if (this.$route.fullPath === '/interface/dapps/manage-ens') {
        this.$router.push({ path: 'manage-ens/owned' });
      } else {
        this.$router.push({ path: 'owned' });
      }
      this.loading = false;
    },
    async fetchTxtRecords(resolver) {
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
          throw new Error('not supported');
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
          contract.methods.setText(this.nameHash, i, obj[i]).encodeABI()
        );
      }
      const tx = {
        from: address,
        to: resolverAddr,
        data: contract.methods.multicall(multicalls).encodeABI(),
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed(),
        value: 0
      };
      this.web3.eth.sendTransaction(tx);
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
