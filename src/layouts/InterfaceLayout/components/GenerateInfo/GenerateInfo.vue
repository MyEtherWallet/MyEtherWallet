<template>
  <div class="generate-info">
    <div class="page-wrap">

      <div class="main-form-block">
        <div class="form-container single--1">
          <dropdown-address-selector :options="addressSelector" />
        </div>
        <div 
          v-if="moreInfoGenerated" 
          class="form-container single--1">
          <standard-input :options="inputNonce" />
        </div>
      </div><!-- .main-form-block -->



      <div 
        v-if="!moreInfoGenerated" 
        class="page--bottom-button-container">
        <standard-button 
          :options="buttonGenerate"
          @click.native="moreInfoGenerated = true"
        />
      </div>


      <div 
        v-if="moreInfoGenerated" 
        class="page--bottom-button-container">
        <standard-button 
          :options="buttonContinue"
          @click.native="moreInfoGenerated = false"
        />
      </div>


      <interface-bottom-text
        link="/"
        question="Have issues?"
        link-text="Learn More"/>


        <!--
      <div class="send-form">
        <div class="title-container">
          <div class="title-and-copy">
            <div><h4>From Address</h4></div>
            <div class="form-controller">
              <p
                class="linker-1 prevent-user-select"
                @click="deleteFromAddress">Clear</p>
              <p
                class="linker-1 prevent-user-select"
                @click="copyFromAddress">Copy</p>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input
            v-show="false"
            ref="fromaddress"
            :value="$store.state.wallet.getAddressString()"
            type="text"
            placeholder="From Address"
            autocomplete="off" >
          
          <div 
            v-show="false" 
            class="good-button-container">
            <i
              :class="[isValid ? 'not-good' : '', 'fa fa-check-circle good-button']"
              aria-hidden="true"/>
          </div>
          <dropdown-address-selector />
        </div>
      </div>
      <tx-speed-input
        v-show="moreInfoGenerated"
        :nonce="nonce"
        :gas-limit="gasLimit"
        @gasLimitUpdate="gasLimitUpdated"
        @nonceUpdate="nonceUpdated"/>

      <div
        v-if="!moreInfoGenerated" 
        :class="onBottomOfPage ? 'hide-mobile-button' : ''"
        class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="generateInfo">
          <div class="button-content">
            <p>Generate</p>
          </div>
        </div>
      </div>

      <div
        v-if="moreInfoGenerated" 
        :class="onBottomOfPage ? 'hide-mobile-button' : ''"
        class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="generateTx">
          <div class="button-content">
            <p>Continue</p>
            <img :src="arrow">
          </div>
        </div>
      </div>

      <interface-bottom-text
        link="/"
        question="Have issues?"
        link-text="Learn More"/>
      -->


    </div><!-- .page-wrap -->
  </div><!-- .generate-info -->
</template>

<script>
import ContinueArrow from '@/assets/images/icons/continue-arrow.svg';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import TxSpeedInput from '../../components/TxSpeedInput';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput,
    'dropdown-address-selector': DropDownAddressSelector
  },
  props: {
    gasLimit: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      buttonGenerate: {
        title: 'Generate',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      },
      buttonContinue: {
        title: 'Continue',
        buttonStyle: 'green',
        rightArrow: true,
        fullWidth: false
      },
      addressSelector: {
        title: 'From Address',
        buttonCopy: true,
        buttonClear: true,
        popover: 'What is address'
      },
      inputNonce: {
        title: 'Nonce',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: this.$t('popover.whatIsDataContent'),
        placeHolder: '',
        rightInputText: ''
      },
      moreInfoGenerated: false,
      isValid: false,
      onBottomOfPage: false,
      arrow: ContinueArrow
    };
  },
  beforeMount() {
    window.addEventListener('scroll', this.onPageScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onPageScroll);
  },
  methods: {
    onPageScroll() {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        this.onBottomOfPage = true;
      } else {
        this.onBottomOfPage = false;
      }
    },
    generateInfo() {
      this.moreInfoGenerated = true;
    },
    copyFromAddress() {
      this.$refs.fromaddress.select();
      document.execCommand('copy');
    },
    deleteFromAddress() {
      this.$refs.fromaddress.value = '';
    },
    generateTx() {
      this.$emit('pathUpdate', 'genTx');
    },
    gasLimitUpdated(e) {
      this.$emit('gasLimitUpdate', e);
    },
    nonceUpdated(e) {
      this.$emit('nonceUpdate', e);
    },
    checkAddress() {
      return this.$store.state.web3.utils.isAddress(
        this.$store.state.wallet.getAddressString()
      );
    },
    mounted() {
      this.isValid = this.checkAddress();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../InformationBlockForms-desktop';
@import '../InformationBlockForms-tablet';
@import '../InformationBlockForms-mobile';
</style>
