<template>
  <div class="register-domain-container">
    <back-button :reset-view="resetView"/>
    <ens-bid
      v-show="uiState === 'nameAvailableAuctionNotStarted'"
      :cancel="cancel"
      :bid-amount="bidAmount"
      :bid-mask="bidMask"
      :secret-phrase="secretPhrase"
      :create-bid="createBid"
      :ens-name="domainName"/>
    <initial-state
      v-show="uiState === 'initial'"
      :domain-buy-button-click="domainBuyButtonClick"
      :check-domain="checkDomain"
      :loading="loading"
      @domainNameChange="updateDomainName"
    />
    <name-forbidden
      v-show="uiState === 'nameForbidden'"
      :domain-name="domainName"
    />
  </div>
</template>

<script>
import BackButton from '../../components/BackButton';
import EnsBid from './components/EnsBid';
import NameForbidden from './components/NameForbidden';
import InitialState from './components/InitialState';
import EnsAbi from '@/helpers/ensAbi';
import RegistrarAbi from '@/helpers/registrarAbi';
import Misc from '@/helpers/misc';

export default {
  components: {
    'back-button': BackButton,
    'ens-bid': EnsBid,
    'initial-state': InitialState,
    'name-forbidden': NameForbidden
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
      bidAmount: 0,
      bidMask: 0,
      secretPhrase: ''
    };
  },
  methods: {
    async forEth() {
      const web3 = this.$store.state.web3;
      const ensContract = new web3.eth.Contract(
        EnsAbi,
        '0x314159265dd8dbb310642f98f50c066173c1259b'
      );

      const ownerAddress = await ensContract.methods
        .owner(Misc.nameHash('eth', web3))
        .call();

      const auctionRegistrarContract = new web3.eth.Contract(
        RegistrarAbi,
        ownerAddress
      );

      const domainStatus = await auctionRegistrarContract.methods
        .entries(web3.utils.sha3(this.domainName))
        .call();

      this.processResult(domainStatus[0]);
    },
    async checkDomain() {
      const network = this.$store.state.network;
      this.loading = true;
      switch (network.type.name) {
        case 'ETH':
          await this.forEth();
          break;
        default:
          console.log('Lmao');
      }
      this.loading = false;
    },
    processResult(res) {
      switch (res) {
        case '0':
          this.uiState = 'nameAvailableAuctionNotStarted';
          break;
        case '1':
          console.log('Name is available and the auction has been started');
          break;
        case '2':
          console.log('Name is taken and currently owned by someone');
          break;
        case '3':
          this.uiState = 'nameIsForbidden';
          break;
        case '4':
          console.log('Name is currently in the ‘reveal’ stage of the auction');
          break;
      }
    },
    cancel() {
      this.uiState = 'initial';
      this.clearInputs();
    },
    updateDomainName(value) {
      this.domainName = value;
    },
    createBid() {
      console.log('Lmao');
    },
    clearInputs() {
      this.bidAmount = 0;
      this.bidMask = 0;
      this.secretPhrase = '';
    },
    domainBuyButtonClick() {}
  }
};
</script>

<style lang="scss" scoped>
@import 'RegisterDomainContainer.scss';
</style>
