<template>
  <div class="register-domain-container">
    <back-button />
    <router-view
      :contract-initiated="contractInitiated"
      :check-domain="checkDomain"
      :bid-amount="bidAmount"
      :bid-mask="bidMask"
      :secret-phrase="secretPhrase"
      :start-auction-and-bid="startAuctionAndBid"
      :domain-name="domainName"
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
      :tld="network.type.ens.registrarTLD"
      :network-name="network.type.name"
      :register-fifs-name="registerFifsName"
      @updateSecretPhrase="updateSecretPhrase"
      @updateBidAmount="updateBidAmount"
      @updateBidMask="updateBidMask"
      @domainNameChange="updateDomainName"
      @updateStep="updateStep"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import RegistrarAbi from './ABI/registrarAbi';
import DeedContractAbi from './ABI/deedContractAbi';
import RegistryAbi from './ABI/registryAbi.js';
import FifsRegistrarAbi from './ABI/fifsRegistrarAbi.js';
import ResolverAbi from './ABI/resolverAbi.js';
import bip39 from 'bip39';
import * as unit from 'ethjs-unit';
import * as nameHashPckg from 'eth-ens-namehash';
import normalise from '@/helpers/normalise';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
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
      auctionRegistrarContract: {},
      raw: {},
      highestBid: '',
      contractInitiated: false,
      step: 1,
      domainNameErr: false,
      ensRegistryContract: {}
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      account: 'account',
      ens: 'ens'
    }),
    registrarTLD() {
      return this.network.type.ens.registrarTLD;
    },
    registrarType() {
      return this.network.type.ens.registrarType;
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
      this.auctionRegistrarContract = {};
      this.raw = {};
      this.highestBid = '';
      this.contractInitiated = false;
      this.step = 1;
      this.contractInitiated = false;
      this.contractInitiated = true;
      this.domainNameErr = false;
      if (this.ens) {
        this.setRegistrar();
      }
    },
    async setRegistrar() {
      const web3 = this.web3;
      this.registrarAddress = await this.getRegistrarAddress();
      this.auctionRegistrarContract = new web3.eth.Contract(
        RegistrarAbi,
        this.registrarAddress
      );
      this.fifsRegistrarContract = new web3.eth.Contract(
        FifsRegistrarAbi,
        this.registrarAddress
      );
      this.ensRegistryContract = new web3.eth.Contract(
        RegistryAbi,
        this.network.type.ens.registry
      );
    },
    async transferDomain(toAddress) {
      let to, data;
      if (this.registrarType === 'auction') {
        data = await this.auctionRegistrarContract.methods
          .transfer(this.labelHash, toAddress)
          .encodeABI();
        to = this.registrarAddress;
      } else if (this.registrarType === 'fifs') {
        data = await this.ensRegistryContract.methods
          .setOwner(this.nameHash, toAddress)
          .encodeABI();
        to = this.network.type.ens.registry;
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
      const from = this.account.address;

      // Public resolver address
      const resolver = await this.ens.resolver('resolver.eth');
      const publicResolverAddress = await resolver.addr();
      const publicResolverContract = new web3.eth.Contract(
        ResolverAbi,
        publicResolverAddress
      );
      const rawTx1 = {
        to: this.network.type.ens.registry,
        from: from,
        data: this.ensRegistryContract.methods
          .setResolver(this.nameHash, publicResolverAddress)
          .encodeABI(),
        value: 0
      };
      const rawTx2 = {
        to: publicResolverAddress,
        from: from,
        data: publicResolverContract.methods
          .setAddr(this.nameHash, newResolverAddr)
          .encodeABI(),
        value: 0
      };
      web3.mew.sendBatchTransactions([rawTx1, rawTx2]);
    },
    async finalize() {
      const address = this.account.address;
      const web3 = this.web3;
      const data = await this.auctionRegistrarContract.methods
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
      const data = await this.fifsRegistrarContract.methods
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
    async getRegistrarAddress() {
      const registrarAddress = await this.ens.owner(this.registrarTLD);
      return registrarAddress;
    },
    async checkDomain() {
      const web3 = this.web3;
      this.loading = true;
      this.labelHash = web3.utils.sha3(this.domainName);
      try {
        let domainStatus = [];
        if (this.registrarType === 'auction') {
          domainStatus = await this.auctionRegistrarContract.methods
            .entries(this.labelHash)
            .call();
          this.processResult(domainStatus);
        } else if (this.registrarType === 'fifs') {
          const expiryTime = await this.fifsRegistrarContract.methods
            .expiryTimes(this.labelHash)
            .call();
          const isAvailable = expiryTime * 1000 < new Date().getTime();
          if (isAvailable) {
            this.$router.push({ path: 'register-domain/fifs' });
            this.loading = false;
          } else {
            this.getMoreInfo();
            this.loading = false;
          }
        }
      } catch (e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      }
    },
    updateStep(val) {
      this.step = val;
    },
    processResult(res) {
      this.auctionDateEnd = res[2] * 1000;
      switch (res[0]) {
        case '0':
          this.generateKeyPhrase();
          this.$router.push({
            path: 'register-domain/auction'
          });
          this.loading = false;
          break;
        case '1':
          this.generateKeyPhrase();
          this.loading = false;
          this.$router.push({ path: 'register-domain/bid' });
          break;
        case '2':
          this.getMoreInfo(res[1]);
          break;
        case '3':
          this.loading = false;
          this.$router.push({
            path: 'register-domain/forbidden'
          });
          break;
        case '4':
          this.loading = false;
          this.highestBid = unit.fromWei(res[4], 'ether').toString();
          this.$router.push({ path: 'register-domain/reveal' });
          break;
      }
    },
    updateDomainName(value) {
      if (
        value.substr(0, 2) === '0x' ||
        value.length < 7 ||
        value.indexOf('.') !== -1
      ) {
        this.domainNameErr = true;
      } else {
        this.domainNameErr = false;
      }
      try {
        normalise(value);
      } catch (e) {
        Toast.responseHandler(e, Toast.WARN);
        this.domainNameErr = true;
        return;
      }
      this.domainName = normalise(value);
    },
    async getMoreInfo(deedOwner) {
      let highestBidder = '0x';
      if (this.registrarType === 'auction') {
        const deedContract = new this.web3.eth.Contract(
          DeedContractAbi,
          deedOwner
        );
        highestBidder = await deedContract.methods.owner().call();
      }
      let owner;
      let resolverAddress;
      try {
        owner = await this.ens.owner(`${this.domainName}.${this.registrarTLD}`);
      } catch (e) {
        owner = '0x';
        Toast.responseHandler(e, false);
      }
      try {
        resolverAddress = await this.ens
          .resolver(`${this.domainName}.${this.registrarTLD}`)
          .addr();
      } catch (e) {
        resolverAddress = '0x';
      }

      this.nameHash = nameHashPckg.hash(
        `${this.domainName}.${this.registrarTLD}`
      );
      this.resolverAddress = resolverAddress;
      this.deedOwner = highestBidder;
      this.owner = owner;
      this.$router.push({ path: 'register-domain/owned' });
      this.loading = false;
    },
    async createTransaction(type) {
      this.loading = true;
      const address = this.account.address;
      const utils = this.web3.utils;
      const bidHash = await this.auctionRegistrarContract.methods
        .shaBid(
          this.labelHash,
          address,
          utils.toWei(this.bidAmount.toString(), 'ether'),
          utils.sha3(this.secretPhrase)
        )
        .call();

      let contractReference;
      if (type === 'start') {
        contractReference = this.auctionRegistrarContract.methods.startAuctionsAndBid(
          [this.labelHash],
          bidHash
        );
      } else if (type === 'bid') {
        contractReference = this.auctionRegistrarContract.methods.newBid(
          bidHash
        );
      } else if (type === 'reveal') {
        contractReference = this.auctionRegistrarContract.methods.unsealBid(
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
@import 'RegisterDomain.scss';
</style>
