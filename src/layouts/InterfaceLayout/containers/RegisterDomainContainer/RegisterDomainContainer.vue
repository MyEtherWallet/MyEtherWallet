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
    <div v-show="uiState === 'initial'">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.registerDns') }}</h4>
            <p>{{ $t('interface.registerDnsDesc') }}</p>
          </div>
        </div>
        <div class="the-form domain-name">
          <input
            v-model="domainName"
            :class="[domainName.length <= 7 && domainName !== '' ? 'errored' : '']"
            type="text"
            name=""
            placeholder="Please Enter at Least 7 Characters" >
          <span>.eth</span>
        </div>
        <p
          v-show="domainName.length <= 7 && domainName !== ''"
          class="erroredMsg"> Domain name is less than 7 characters. </p>
      </div>

      <div class="submit-button-container">
        <div
          :class="[domainName.length <= 7 ? 'disabled' : '','submit-button large-round-button-green-filled clickable']"
          @click="checkDomain">
          <span v-show="!loading"> {{ $t('interface.checkDomain') }} </span>
          <i
            v-show="loading"
            class="fa fa-spinner fa-spin"/>
        </div>

      </div>
      <div class="flex-container">
        <div class="title-container">
          <h4 class="modal-title">{{ $t('interface.subDomain') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="expendDomainCheckForm" >
                <span class="slider round"/>
              </label>
            </div>
          </div>
        </div>
        <div
          ref="checkForm"
          class="domain-check-form hidden">
          <div class="domain-checker">
            <input
              type="number"
              name=""
              value=""
              placeholder="Enter Domain Name" >
            <div
              class="check-button"
              @click="domainAvailabilityCheck">
              {{ $t('common.check') }}
            </div>
          </div>
        </div>
        <div
          ref="domainList"
          class="sub-domain-list hidden">
          <h4 class="title">{{ $t('interface.allSubDomains') }}</h4>
          <ul>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border very-small-circle-button-green-filled"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div
                  class="buy-button very-small-circle-button-green-border"
                  @click="domainBuyButtonClick($event)">
                  {{ $t('common.buy') }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="/"/>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BackButton from '../../components/BackButton';
import EnsBid from '../../components/EnsBid';
import EnsAbi from '@/helpers/ensAbi';
import RegistrarAbi from '@/helpers/registrarAbi';
import Misc from '@/helpers/misc';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton,
    'ens-bid': EnsBid
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
          console.log('Name is forbidden');
          break;
        case '4':
          console.log('Name is currently in the ‘reveal’ stage of the auction');
          break;
        case '5':
          console.log(
            'Name is not yet available due to the ‘soft launch’ of names.'
          );
          break;
      }
    },
    cancel() {
      this.uiState = 'initial';
      this.clearInputs();
    },
    createBid() {
      console.log('Lmao');
    },
    clearInputs() {
      this.bidAmount = 0;
      this.bidMask = 0;
      this.secretPhrase = '';
    },
    expendDomainCheckForm() {
      this.$refs['checkForm'].classList.toggle('hidden');
      this.$refs['domainList'].classList.add('hidden');
    },
    domainAvailabilityCheck() {
      this.$refs['domainList'].classList.add('hidden');
    },
    domainBuyButtonClick() {}
  }
};
</script>

<style lang="scss" scoped>
@import 'RegisterDomainContainer.scss';
</style>
