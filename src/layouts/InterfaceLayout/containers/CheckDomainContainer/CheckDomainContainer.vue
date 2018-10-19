<template>
  <div class="register-domain-container">
    <back-button 
      :reset-view="resetView" 
      :options="backButtonOptions" />

    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          bestkat1234.eth is available
        </div>
        <div class="dropdown-information">
          <dropdown-bid-info />
        </div>
        <div class="user-messages">
          <p>
            You CAN NOT claim your name unless you have this
            information during the reveal process.
            We suggest that you save those information locally.
          </p>
        </div>
        <div class="domain-detail-info">
          <ul>
            <li>
              <div class="info-title">
                <p>Actual Bid Amount</p>
                <popover 
                  popcontent="Hello Good bye~"/>
              </div>
              <div class="info-data">
                <p>0.05 ETH</p>
              </div>
            </li>
            <li>
              <div class="info-title">
                <p>Secret Phrase</p>
                <popover 
                  popcontent="Hello Good bye~"/>
              </div>
              <div class="info-data">
                <p>Suffer Ramp Power</p>
              </div>
            </li>
            <li>
              <div class="info-title">
                <p>Reveal Date</p>
                <popover 
                  popcontent="Hello Good bye~"/>
              </div>
              <div class="info-data">
                <p>Wed 09/05/2018 15:43 GMT - 12:43 PDT</p>
              </div>
            </li>
            <li>
              <div class="info-title">
                <p>Bid Mask</p>
              </div>
              <div class="info-data">
                <p>0.06 ETH</p>
              </div>
            </li>
            <li>
              <div class="info-title">
                <p>Auction Ends</p>
              </div>
              <div class="info-data">
                <p>Fri 09/07/2018 15:41 GMT - 1:22 PDT</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="json-string-input">
          <standard-input :options="inputJSONString" />
        </div>
      </div>

      <div class="block__submit-button">
        <standard-button 
          :options="buttonCheckDomain"
          class="the-submit-button"
          @click.native="modalStatusDomainTaken = 'show'"
        />
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>
      </div>
    </div><!-- .content-container -->

    <domain-confirm-modal />
    <success-modal />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BackButton from '../../components/BackButton';
import DropdownBidInfo from '../../components/DropdownBidInfo';
import DomainConfirmModal from '@/containers/ConfirmationContainer/components/DomainConfirmModal';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton,
    'dropdown-bid-info': DropdownBidInfo,
    'domain-confirm-modal': DomainConfirmModal,
    'success-modal': SuccessModal
  },
  props: {},
  data() {
    return {
      backButtonOptions: {
        titleText: this.$t('common.checkDomain')
      },
      buttonCheckDomain: {
        title: 'Save & Next',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      },
      inputJSONString: {
        title: 'JSON String',
        value:
          '"address": "0x98923492735927390527930270345723094729034793"\nkjhwerifhwefiohw\n98u98u432r 23r723gr8273r23r\niujerwiuf2h9f3hefr983fr9823hr9283yr9238ry',
        type: 'text',
        buttonCopy: true,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        isTextarea: true
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'CheckDomainContainer-desktop.scss';
@import 'CheckDomainContainer-tablet.scss';
@import 'CheckDomainContainer-mobile.scss';
</style>
