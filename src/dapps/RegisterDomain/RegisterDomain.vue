<template>
  <div class="register-domain-container">
    <back-button :reset-view="resetView"/>
    <ens-bid-container
      v-if="uiState === 'nameAvailableAuctionNotStarted' || uiState === 'nameAvailableAuctionStarted'"
      :cancel="cancel"
      :bid-amount="bidAmount"
      :bid-mask="bidMask"
      :secret-phrase="secretPhrase"
      :start-auction-and-bid="startAuctionAndBid"
      :domain-name="domainName"
      :state="uiState"
      :auction-date-end="auctionDateEnd"
      @updateSecretPhrase="updateSecretPhrase"
      @updateBidAmount="updateBidAmount"
      @updateBidMask="updateBidMask"
    />
    <confirm-container
      v-if="uiState === 'confirmationPage'"
      :ens="ens"
      :from-page="fromPage"
      :back="back"
    />
    <initial-state-container
      v-if="uiState === 'initial'"
      :domain-buy-button-click="domainBuyButtonClick"
      :check-domain="checkDomain"
      :domain-name="domainName"
      :loading="loading"
      @domainNameChange="updateDomainName"
    />
    <name-forbidden-container
      v-if="uiState === 'nameIsForbidden'"
      :cancel="cancel"
      domain-name="hellothere!"
    />
    <already-owned-container
      v-if="uiState === 'nameOwned'"
      :name-hash="nameHash"
      :label-hash="labelHash"
      :owner="owner"
      :resolver-address="resolverAddress"
      :deed-owner="deedOwner"
      :domain-name="domainName"
      :cancel="cancel"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import ConfirmContainer from './containers/ConfirmContainer';
import EnsBidContainer from './containers/EnsBidContainer';
import NameForbiddenContainer from './containers/NameForbiddenContainer';
import InitialStateContainer from './containers/InitialStateContainer';
import AlreadyOwnedContainer from './containers/AlreadyOwnedContainer';
import RegistrarAbi from '@/helpers/registrarAbi';
import { Misc } from '@/helpers';
import bip39 from 'bip39';
// eslint-disable-next-line
const unit = require('ethjs-unit');
export default {
  components: {
    'back-button': BackButton,
    'confirm-container': ConfirmContainer,
    'ens-bid-container': EnsBidContainer,
    'initial-state-container': InitialStateContainer,
    'name-forbidden-container': NameForbiddenContainer,
    'already-owned-container': AlreadyOwnedContainer
  },
  props: {
    resetView: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      domainName: '',
      loading: false,
      uiState: 'initial',
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
      fromPage: 'initial'
    };
  },
  async mounted() {
    this.registrarAddress = await this.getRegistrarAddress();
    this.auctionRegistrarContract = new this.$store.state.web3.eth.Contract(
      RegistrarAbi,
      this.registrarAddress
    );
  },
  methods: {
    async getRegistrarAddress() {
      const registrarAddress = await this.$store.state.ens.owner('eth');
      return registrarAddress;
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
        console.log(e);
      }
    },
    processResult(res) {
      switch (res[0]) {
        case '0':
          this.generateKeyPhrase();
          this.uiState = 'nameAvailableAuctionNotStarted';
          this.loading = false;
          break;
        case '1':
          this.generateKeyPhrase();
          this.loading = false;
          this.auctionDateEnd = res[2] * 1000;
          this.uiState = 'nameAvailableAuctionStarted';
          break;
        case '2':
          this.getMoreInfo(res[1]);
          break;
        case '3':
          this.loading = false;
          this.uiState = 'nameIsForbidden';
          break;
        case '4':
          this.loading = false;
          this.uiState = 'nameAvailableAuctionStartedBidUnavailable';
          console.log('Name is currently in the ‘reveal’ stage of the auction');
          break;
      }
    },
    back() {
      this.uiState = this.from;
    },
    cancel() {
      this.uiState = 'initial';
      this.clearInputs();
    },
    updateDomainName(value) {
      this.domainName = value;
    },
    async getMoreInfo(deedOwner) {
      let owner;
      let resolverAddress;
      try {
        owner = await this.$store.state.ens.owner(this.domainName + '.eth');
      } catch (e) {
        owner = '0x';
      }

      try {
        resolverAddress = await this.$store.state.ens
          .resolver(this.domainName + '.eth')
          .resolverAddress();
      } catch (e) {
        resolverAddress = '0x';
      }

      this.nameHash = Misc.nameHash(
        this.domainName + '.eth',
        this.$store.state.web3
      );

      this.deedOwner = deedOwner;
      this.owner = owner;
      this.resolverAddress = resolverAddress;
      this.uiState = 'nameOwned';
      this.loading = false;
    },
    async startAuctionAndBid() {
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

      const auctionBidObj = this.auctionRegistrarContract.methods.startAuctionsAndBid(
        [domainName],
        bidHash
      );

      const nonce = await this.$store.state.web3.eth.getTransactionCount(
        this.$store.state.wallet.getAddressString()
      );

      const gas = await auctionBidObj.estimateGas({
        from: address,
        to: this.registrarAddress,
        value: utils.toWei(this.bidMask.toString(), 'ether')
      });

      const date = new Date();
      const auctionDateEnd = date.setDate(date.getDate() + 5);
      const revealDate = date.setDate(date.getDate() - 2);
      const raw = {
        from: address,
        gas: gas,
        nonce: nonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        value: Number(unit.toWei(this.bidMask, 'ether')),
        to: this.registrarAddress,
        data: auctionBidObj.encodeABI(),
        chainId: this.$store.state.network.type.chainID,
        name: this.domainName,
        nameSHA3: utils.sha3(this.domainName),
        bidAmount: this.bidAmount,
        bidMask: this.bidMask,
        secretPhrase: this.secretPhrase,
        secretPhraseSHA3: utils.sha3(this.secretPhrase),
        auctionDateEnd: new Date(auctionDateEnd),
        revealDate: new Date(revealDate)
      };

      if (window.web3 && this.$store.state.wallet.identifier === 'Web3') {
        raw['web3WalletOnly'] = true;
      }

      this.raw = raw;
      this.uiState = 'confirmationPage';
      this.fromPage = 'nameAvailableAuctionNotStarted';
    },
    clearInputs() {
      this.loading = false;
      this.uiState = 'initial';
      this.bidAmount = 0.01;
      this.bidMask = 0.02;
      this.nameHash = '';
      this.labelHash = '';
      this.owner = '';
      this.resolverAddress = '';
      this.deedOwner = '';
      this.secretPhrase = '';
      this.domainName = '';
    },
    domainBuyButtonClick() {},
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
