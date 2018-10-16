<template>
  <div class="register-domain-container">
    <back-button/>
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
import RegistrarAbi from '@/helpers/registrarAbi';
import DeedContractAbi from '@/helpers/deedContractAbi';
import bip39 from 'bip39';
import * as unit from 'ethjs-unit';
import * as nameHashPckg from 'eth-ens-namehash';
import * as uts46 from 'idna-uts46';

const ETH_TLD = '.eth';

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
      auctionRegistrarContract: function() {},
      raw: {},
      highestBid: '',
      contractInitiated: false,
      step: 1,
      domainNameErr: false
    };
  },
  mounted() {
    this.setup();
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
      this.auctionRegistrarContract = function() {};
      this.raw = {};
      this.highestBid = '';
      this.contractInitiated = false;
      this.step = 1;
      this.contractInitiated = false;
      this.registrarAddress = await this.getRegistrarAddress();
      this.auctionRegistrarContract = new this.$store.state.web3.eth.Contract(
        RegistrarAbi,
        this.registrarAddress
      );
      this.contractInitiated = true;
      this.domainNameErr = false;
    },
    async finalize() {
      const address = this.$store.state.wallet.getAddressString();
      const web3 = this.$store.state.web3;
      const name = web3.utils.sha3(this.domainName);
      const data = await this.auctionRegistrarContract.methods
        .finalizeAuction(name)
        .encodeABI();

      const raw = {
        from: address,
        value: 0,
        to: this.registrarAddress,
        data: data
      };

      web3.eth.sendTransaction(raw);
    },
    async getRegistrarAddress() {
      const registrarAddress = await this.$store.state.ens.owner(
        ETH_TLD.replace('.', '')
      );
      return registrarAddress;
    },
    normalise(str) {
      return uts46.toUnicode(str, {
        useStd3ASCII: true,
        transitional: false
      });
    },
    async checkDomain() {
      const web3 = this.$store.state.web3;
      this.loading = true;
      this.labelHash = web3.utils.sha3(this.domainName);

      try {
        const domainStatus = await this.auctionRegistrarContract.methods
          .entries(this.labelHash)
          .call();
        this.processResult(domainStatus);
      } catch (e) {
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
        this.normalise(value);
      } catch (e) {
        this.domainNameErr = true;
        return;
      }
      this.domainName = this.normalise(value);
    },
    async getMoreInfo(deedOwner) {
      const deedContract = new this.$store.state.web3.eth.Contract(
        DeedContractAbi,
        deedOwner
      );
      const highestBidder = await deedContract.methods.owner().call();
      let owner;
      let resolverAddress;
      try {
        owner = await this.$store.state.ens.owner(this.domainName + ETH_TLD);
      } catch (e) {
        owner = '0x';
      }

      try {
        resolverAddress = await this.$store.state.ens
          .resolver(this.domainName + ETH_TLD)
          .resolverAddress();
      } catch (e) {
        resolverAddress = '0x';
      }

      this.nameHash = nameHashPckg.hash(this.domainName + ETH_TLD);

      this.deedOwner = highestBidder;
      this.owner = owner;
      this.resolverAddress = resolverAddress;
      if (
        this.owner === '0x0000000000000000000000000000000000000000' &&
        highestBidder === this.$store.state.wallet.getAddressString()
      ) {
        this.$router.push({ path: 'register-domain/finalize' });
      } else {
        this.$router.push({ path: 'register-domain/owned' });
      }

      this.loading = false;
    },
    async createTransaction(type) {
      this.loading = true;
      const address = this.$store.state.wallet.getAddressString();
      const utils = this.$store.state.web3.utils;
      const domainName = utils.sha3(this.domainName);
      const bidHash = await this.auctionRegistrarContract.methods
        .shaBid(
          domainName,
          address,
          utils.toWei(this.bidAmount.toString(), 'ether'),
          utils.sha3(this.secretPhrase)
        )
        .call();

      let contractReference;
      if (type === 'start') {
        contractReference = this.auctionRegistrarContract.methods.startAuctionsAndBid(
          [domainName],
          bidHash
        );
      } else if (type === 'bid') {
        contractReference = this.auctionRegistrarContract.methods.newBid(
          bidHash
        );
      } else if (type === 'reveal') {
        contractReference = this.auctionRegistrarContract.methods.unsealBid(
          domainName,
          utils.toWei(this.bidAmount.toString(), 'ether'),
          utils.sha3(this.secretPhrase)
        );
      }

      const date = new Date();
      const auctionDateEnd = date.setDate(date.getDate() + 5);
      const revealDate = date.setDate(date.getDate() - 2);
      const raw = {
        from: address,
        value: unit.toWei(this.bidMask, 'ether').toString(),
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
