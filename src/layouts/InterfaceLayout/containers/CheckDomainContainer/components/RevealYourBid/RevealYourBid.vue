<template>
  <div class="domain-available">
    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          Reveal your bid for bestket1988.eth now.
          <p>0.2 ETH <span>(Current highest bid)</span></p>
        </div>
        <div class="auction-time">
          <div class="time-left">
            <img src="@/assets/images/icons/sand-timer.png">
            Auction closes <span>4 Days 02:22:43</span>
          </div>
          <div class="closing-date-time">09/08/2018 (15:34 GMT - 12:43 PDT)</div>
        </div>
        <div class="auction-time">
          <div class="time-left">
            <img src="@/assets/images/icons/sand-timer.png">
            Reveal bids <span>2 Days 02:22:43</span>
          </div>
          <div class="closing-date-time">09/08/2018 (15:34 GMT - 12:43 PDT)</div>
        </div>
        <div class="dropdown-information">
          <dropdown-bid-info />
        </div>
      </div>

      <div class="block__submit-button">
        <div class="button-block">
          <standard-button 
            :options="buttonJsonString"
            class="the-submit-button"
            @click.native="modalStatusDomainTaken = 'show'"
          />
          <standard-button 
            :options="buttonNext"
            class="the-submit-button"
            @click.native="modalStatusDomainTaken = 'show'"
          />
        </div>
        <div class="button-block">
          <standard-button 
            :options="buttonRevealBid"
            class="reveal-bid-button"
            @click.native="modalStatusDomainTaken = 'show'"
          />
        </div>
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>
      </div>
    </div><!-- .content-container -->

    <domain-confirm-modal />
    <success-modal />
    <json-string-modal />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import DropdownBidInfo from '../DropdownBidInfo';
import DomainConfirmModal from '@/containers/ConfirmationContainer/components/DomainConfirmModal';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';
import JsonStringModal from '../../../../components/JsonStringModal';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'dropdown-bid-info': DropdownBidInfo,
    'domain-confirm-modal': DomainConfirmModal,
    'success-modal': SuccessModal,
    'json-string-modal': JsonStringModal
  },
  props: {},
  data() {
    return {
      buttonRevealBid: {
        title: 'Reveal Bid',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      },
      buttonJsonString: {
        title: 'JSON String',
        buttonStyle: 'green-border',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      },
      buttonNext: {
        title: 'Next',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'RevealYourBid-desktop.scss';
@import 'RevealYourBid-tablet.scss';
@import 'RevealYourBid-mobile.scss';
</style>
