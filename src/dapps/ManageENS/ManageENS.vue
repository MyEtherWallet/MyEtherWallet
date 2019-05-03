<template>
  <div class="manage-ens-container">
    <back-button />
    <router-view
      :contract-initiated="contractInitiated"
      :check-domain="checkDomain"
      :bid-amount="bidAmount"
      :bid-mask="bidMask"
      :secret-phrase="secretPhrase"
      :start-auction-and-bid="startAuctionAndBid"
      :host-name="parsedHostName"
      :domain-name="parsedDomainName"
      :auction-date-end="auctionDateEnd"
      :loading="loading"
      :name-hash="nameHash"
      :label-hash="labelHash"
      :owner="owner"
      :resolver-address="resolverAddress"
      :deed-owner="deedOwner"
      :highest-bidder="highestBid"
      :raw="raw"
      :step="step"
      :send-bid="sendBid"
      :reveal-bid="revealBid"
      :domain-name-err="domainNameErr"
      :generate-key-phrase="generateKeyPhrase"
      :finalize="finalize"
      :update-resolver="updateResolver"
      :transfer-domain="transferDomain"
      :tld="parsedTld === '' ? network.type.ens.registrarTLD : parsedTld"
      :network-name="network.type.name"
      :register-fifs-name="registerFifsName"
      :multi-tld="multiTld"
      :claim-func="claimFunc"
      :dns-owner="dnsOwner"
      :dns-claim="dnsClaim"
      :transfer-func="transferFunc"
      :create-commitment="createCommitment"
      :register-with-duration="registerWithDuration"
      :minimum-age="minimumAge"
      :commitment-created="commitmentCreated"
      @updateSecretPhrase="updateSecretPhrase"
      @updateBidAmount="updateBidAmount"
      @updateBidMask="updateBidMask"
      @domainNameChange="updateDomainName"
      @updateStep="updateStep"
      @updateDuration="updateDuration"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import RegistrarAbi from './ABI/registrarAbi';
import PermanentRegistrarControllerAbi from './ABI/permanentRegistrarController';
import baseRegistrarAbi from './ABI/baseRegistrarAbi';
import DeedContractAbi from './ABI/deedContractAbi';
import RegistryAbi from './ABI/registryAbi.js';
import FifsRegistrarAbi from './ABI/fifsRegistrarAbi.js';
import ResolverAbi from './ABI/resolverAbi.js';
import * as unit from 'ethjs-unit';
import * as nameHashPckg from 'eth-ens-namehash';
import normalise from '@/helpers/normalise';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
import DNSRegistrar from '@ensdomains/dnsregistrar';
import BigNumber from 'bignumber.js';

const bip39 = require('bip39');

const permanentRegistrar = {
  INTERFACE_CONTROLLER: '0x018fac06',
  INTERFACE_LEGACY_REGISTRAR: '0x7ba18ba1'
};

const REGISTRAR_TYPES = {
  AUCTION: 'auction',
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
      bidAmount: 0.01,
      bidMask: 0.02,
      nameHash: '',
      labelHash: '',
      owner: '',
      resolverAddress: '',
      deedOwner: '',
      secretPhrase: '',
      registrarAddress: '',
      auctionDateEnd: 0,
      raw: {},
      highestBid: '',
      contractInitiated: false,
      step: 1,
      domainNameErr: false,
      ensRegistryContract: {},
      dnsRegistrar: {},
      dnsClaim: {},
      dnsOwner: '',
      legacyRegistrar: {},
      minimumAge: 0,
      duration: 1,
      commitmentCreated: false
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      account: 'account',
      gasPrice: 'gasPrice',
      ens: 'ens'
    }),
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
      this.bidAmount = 0.01;
      this.bidMask = 0.02;
      this.nameHash = '';
      this.labelHash = '';
      this.owner = '';
      this.resolverAddress = '';
      this.deedOwner = '';
      this.secretPhrase = '';
      this.registrarAddress = '';
      this.auctionDateEnd = 0;
      this.raw = {};
      this.highestBid = '';
      this.contractInitiated = false;
      this.step = 1;
      this.contractInitiated = false;
      this.contractInitiated = true;
      this.domainNameErr = false;
      this.dnsRegistrar = {};
      this.dnsClaim = {};
      this.legacyRegistrar = {};
      this.minimumAge = 0;
      this.duration = 1;
      this.commitmentCreated = false;

      if (this.ens) {
        this.setRegistrar();
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
      if (this.registrarType === REGISTRAR_TYPES.AUCTION) {
        this.registrarContract = new web3.eth.Contract(
          RegistrarAbi,
          this.registrarAddress
        );
      } else if (this.registrarType === REGISTRAR_TYPES.FIFS) {
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
          Toast.responseHandler(
            'ENS Permanent registrar is not available yet, please try again later',
            Toast.ERROR
          );
        }
      }
    },
    async transferDomain(toAddress) {
      let to, data;
      if (this.registrarType === REGISTRAR_TYPES.AUCTION) {
        data = await this.registrarContract.methods
          .transfer(this.labelHash, toAddress)
          .encodeABI();
        to = this.registrarAddress;
      } else if (this.registrarType === REGISTRAR_TYPES.FIFS) {
        data = await this.ensRegistryContract.methods
          .setOwner(this.nameHash, toAddress)
          .encodeABI();
        to = this.network.type.ens.registry;
      } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
        data = await this.registrarContract.methods
          .safeTransferFrom(this.account.address, toAddress, this.labelHash)
          .encodeABI();
        to = this.registrarAddress;
      }
      const raw = {
        from: this.account.address,
        to,
        data,
        value: 0
      };
      this.web3.eth.sendTransaction(raw).catch(err => {
        Toast.responseHandler(err, false);
      });
    },
    async updateResolver(newResolverAddr) {
      const web3 = this.web3;
      const address = this.account.address;
      // Public resolver address
      const resolver = await this.ens.resolver('resolver.eth');
      const publicResolverAddress = await resolver.addr();
      const currentResolverAddress = await this.ensRegistryContract.methods
        .resolver(this.nameHash)
        .call();
      const publicResolverContract = new web3.eth.Contract(
        ResolverAbi,
        publicResolverAddress
      );
      const setAddrTx = {
        from: address,
        to: publicResolverAddress,
        data: await publicResolverContract.methods
          .setAddr(this.nameHash, newResolverAddr)
          .encodeABI(),
        value: 0,
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
      };
      if (
        currentResolverAddress.toLowerCase() ===
        publicResolverAddress.toLowerCase()
      ) {
        web3.eth.sendTransaction(setAddrTx).catch(err => {
          Toast.responseHandler(err, false);
        });
      } else {
        const setResolverTx = {
          from: address,
          to: this.network.type.ens.registry,
          data: await this.ensRegistryContract.methods
            .setResolver(this.nameHash, publicResolverAddress)
            .encodeABI(),
          value: 0,
          gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
        };
        web3.mew.sendBatchTransactions([setResolverTx, setAddrTx]);
      }
    },
    async finalize() {
      const address = this.account.address;
      const web3 = this.web3;
      const data = await this.registrarContract.methods
        .finalizeAuction(this.labelHash)
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
      if (this.parsedTld !== '' && isSupported === undefined) {
        Toast.responseHandler(
          `Domain TLD ${this.parsedTld} is not supported in this node!`,
          Toast.ERROR
        );
        this.loading = false;
      } else if (this.parsedTld === this.registrarTLD) {
        try {
          if (this.registrarType === REGISTRAR_TYPES.AUCTION) {
            const domainStatus = await this.registrarContract.methods
              .entries(this.labelHash)
              .call();
            this.processResult(domainStatus);
          } else if (this.registrarType === REGISTRAR_TYPES.FIFS) {
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
          } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
            if (!this.isPermanentLive) {
              Toast.responseHandler(
                'ENS Permanent registrar is not available yet, please try again later',
                Toast.ERROR
              );
              return;
            }
            const oldRegistrarAddress = await this.ens
              .resolver(this.registrarTLD, ResolverAbi)
              .interfaceImplementer(
                permanentRegistrar.INTERFACE_LEGACY_REGISTRAR
              );
            this.legacyRegistrar = new this.web3.eth.Contract(
              RegistrarAbi,
              oldRegistrarAddress
            );
            const legacyState = await this.legacyRegistrar.methods
              .state(this.labelHash)
              .call();
            if (legacyState === 2) {
              this.$router.push({ path: 'manage-ens/transfer-registrar' });
            } else {
              const isAvailable = await this.registrarControllerContract.methods
                .available(this.parsedHostName)
                .call();
              if (!isAvailable) this.getMoreInfo();
              else {
                this.generateKeyPhrase();
                this.$router.push({ path: 'manage-ens/create-commitment' });
                this.loading = false;
              }
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
          if (
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
          Toast.responseHandler(
            'Something went wrong! Please try again.',
            Toast.ERROR
          );
        }
      }
    },
    async createCommitment() {
      const utils = this.web3.utils;
      try {
        const commitment = await this.registrarControllerContract.methods
          .makeCommitment(
            this.parsedHostName,
            this.account.address,
            utils.sha3(this.secretPhrase)
          )
          .call();
        this.minimumAge = await this.registrarControllerContract.methods
          .minCommitmentAge()
          .call();
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
        Toast.responseHandler(
          'Something went wrong! Please try again.',
          Toast.ERROR
        );
      }
    },
    async registerWithDuration() {
      const utils = this.web3.utils;
      this.loading = true;
      const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
      const duration = Math.ceil(SECONDS_YEAR * this.duration);
      try {
        const rentPrice = await this.registrarControllerContract.methods
          .rentPrice(this.parsedHostName, duration)
          .call();
        this.registrarControllerContract.methods
          .register(
            this.parsedHostName,
            this.account.address,
            duration,
            utils.sha3(this.secretPhrase)
          )
          .send({ from: this.account.address, value: rentPrice })
          .once('transactionHash', () => {
            this.$router.push({ path: 'registration-in-progress' });
          })
          .once('receipt', () => {
            this.getMoreInfo();
            // Toast.responseHandler('Successfully Registered!', Toast.SUCCESS);
          });
      } catch (e) {
        this.loading = false;
        Toast.responseHandler(
          'Something went wrong! Please try again.',
          Toast.ERROR
        );
      }
    },
    transferFunc() {
      this.loading = true;
      try {
        this.legacyRegistrar.methods
          .transferRegistrars(this.labelHash)
          .send({ from: this.account.address })
          .once('transactionHash', () => {
            Toast.responseHandler('Transfer Success!', Toast.SUCCESS);
          });
      } catch (e) {
        this.loading = false;
        Toast.responseHandler(
          'Something went wrong! Please try again.',
          Toast.ERROR
        );
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
        Toast.responseHandler(
          'Something went wrong! Please try again.',
          Toast.ERROR
        );
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
    processPermanentRegistrar() {},
    processResult(res) {
      this.auctionDateEnd = res[2] * 1000;
      switch (res[0]) {
        case '0':
          this.generateKeyPhrase();
          this.$router.push({
            path: 'manage-ens/auction'
          });
          this.loading = false;
          break;
        case '1':
          this.generateKeyPhrase();
          this.loading = false;
          this.$router.push({ path: 'manage-ens/bid' });
          break;
        case '2':
          this.getMoreInfo(res[1]);
          break;
        case '3':
          this.loading = false;
          this.$router.push({
            path: 'manage-ens/forbidden'
          });
          break;
        case '4':
          this.loading = false;
          this.highestBid = unit.fromWei(res[4], 'ether').toString();
          this.$router.push({ path: 'manage-ens/reveal' });
          break;
      }
    },
    updateDomainName(value) {
      if (this.parsedTld === this.registrarTLD) {
        this.domainNameErr = value.substr(0, 2) === '0x' || value.length < 7;
      } else {
        this.domainNameErr = false;
      }
      try {
        this.domainName = normalise(value);
      } catch (e) {
        Toast.responseHandler(e, Toast.WARN);
        this.domainNameErr = true;
        return;
      }
    },
    async getMoreInfo(deedOwner) {
      let highestBidder = '0x';
      if (
        this.registrarType === REGISTRAR_TYPES.AUCTION &&
        this.parsedTld === this.registrarTLD
      ) {
        const deedContract = new this.web3.eth.Contract(
          DeedContractAbi,
          deedOwner
        );
        highestBidder = await deedContract.methods.owner().call();
      }
      let owner;
      let resolverAddress;
      try {
        owner = await this.ens.owner(this.parsedDomainName);
      } catch (e) {
        owner = '0x';
        Toast.responseHandler(e, false);
      }
      try {
        resolverAddress = await this.ens.resolver(this.parsedDomainName).addr();
      } catch (e) {
        resolverAddress = '0x';
      }

      this.nameHash = nameHashPckg.hash(this.parsedDomainName);
      this.resolverAddress = resolverAddress;
      this.deedOwner = highestBidder;
      this.owner = owner;
      if (this.$route.fullPath === '/interface/dapps/manage-ens') {
        this.$router.push({ path: 'manage-ens/owned' });
      } else {
        this.$router.push({ path: 'owned' });
      }
      this.loading = false;
    },
    async createTransaction(type) {
      this.loading = true;
      const address = this.account.address;
      const utils = this.web3.utils;
      const bidHash = await this.registrarContract.methods
        .shaBid(
          this.labelHash,
          address,
          utils.toWei(this.bidAmount.toString(), 'ether'),
          utils.sha3(this.secretPhrase)
        )
        .call();

      let contractReference;
      if (type === 'start') {
        contractReference = this.registrarContract.methods.startAuctionsAndBid(
          [this.labelHash],
          bidHash
        );
      } else if (type === 'bid') {
        contractReference = this.registrarContract.methods.newBid(bidHash);
      } else if (type === 'reveal') {
        contractReference = this.registrarContract.methods.unsealBid(
          this.labelHash,
          utils.toWei(this.bidAmount.toString(), 'ether'),
          utils.sha3(this.secretPhrase)
        );
      }

      const date = new Date();
      const auctionDateEnd = date.setDate(date.getDate() + 5);
      const revealDate = date.setDate(date.getDate() - 2);
      const raw = {
        from: address,
        value:
          type === 'reveal' ? 0 : unit.toWei(this.bidMask, 'ether').toString(),
        to: this.registrarAddress,
        data: contractReference.encodeABI(),
        name: this.domainName,
        nameSHA3: utils.sha3(this.domainName),
        bidAmount: this.bidAmount,
        bidMask: this.bidMask,
        secretPhrase: this.secretPhrase,
        secretPhraseSHA3: utils.sha3(this.secretPhrase),
        auctionDateEnd: new Date(auctionDateEnd),
        revealDate: new Date(revealDate)
      };
      this.raw = raw;
      this.loading = false;
      this.step = 2;
    },
    startAuctionAndBid() {
      this.createTransaction('start');
    },
    sendBid() {
      this.createTransaction('bid');
    },
    revealBid() {
      this.createTransaction('reveal');
    },
    updateSecretPhrase(e) {
      this.secretPhrase = e;
    },
    updateDuration(e) {
      this.duration = e;
    },
    updateBidAmount(val) {
      this.bidAmount = val;
    },
    updateBidMask(val) {
      this.bidMask = val;
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
