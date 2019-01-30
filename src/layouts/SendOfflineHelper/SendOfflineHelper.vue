<template>
  <div class="send-offline-helper">
    <div class="wrap">
      <div class="page-title"><page-title :options="titleOptions" /></div>
      <div class="page-content-container">
        {{ $t('interface.myAddr') }}
        <accordion-menu
          :isopen="true"
          :title="$t('sendOfflineHelper.generateInfo')"
          number="1"
        >
          <dropdown-address-selector title="From Address" />
          <div class="button-container">
            <standard-button :options="continueButton" />
          </div>
        </accordion-menu>
        <accordion-menu
          :isopen="true"
          :title="$t('sendOfflineHelper.txFeeAndNonce')"
          number="2"
        >
          <dropdown-address-selector title="From Address" />
          <div class="button-container">
            <standard-button :options="continueButton" />
          </div>
        </accordion-menu>
        <accordion-menu
          :isopen="true"
          :title="$t('sendOfflineHelper.signedTx')"
          number="3"
        >
          <dropdown-address-selector title="From Address" />
          <div class="button-container">
            <standard-button :options="continueButton" />
          </div>
        </accordion-menu>
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';
import AccordionMenu2 from '@/components/AccordionMenu2';
import DropDownAddressSelector2 from '@/components/DropDownAddressSelector2';
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';

export default {
  components: {
    'page-title': TitleTextContentsLayout,
    'accordion-menu': AccordionMenu2,
    'dropdown-address-selector': DropDownAddressSelector2,
    'standard-button': StandardButton,
    'standard-input': StandardInput
  },
  data() {
    return {
      titleOptions: {
        title: 'Send Offline Helper',
        boldSubTitle: '',
        textContent: [
          'Customize actions, debug reveals, and more with this set of advance tools. Please be mindful of the capabilities and limitations of these tools before using.'
        ]
      },
      continueButton: {
        title: 'Continue',
        buttonStyle: 'green',
        noWalletTerms: true,
        rightArrow: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
