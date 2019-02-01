<template>
  <div class="send-offline-helper">
    <div class="wrap">
      <div class="page-title"><page-title :options="titleOptions" /></div>
      <div class="page-content-container">
        <accordion-menu
          :greytitle="false"
          :editbutton="true"
          :isopen="false"
          :title="$t('sendOfflineHelper.generateInfo')"
          number="1"
        >
          <dropdown-address-selector title="From Address" />
          <div class="button-container">
            <standard-button :options="buttonContinue" />
          </div>
        </accordion-menu>
        <accordion-menu
          :greytitle="false"
          :editbutton="true"
          :isopen="true"
          :title="$t('sendOfflineHelper.txFeeAndNonce')"
          number="2"
        >
          <standard-input :options="inputTxFee" />
          <standard-input :options="inputNonce" />
          <div class="button-container">
            <standard-button :options="buttonContinue" />
          </div>
        </accordion-menu>
        <accordion-menu
          :greytitle="false"
          :isopen="true"
          :title="$t('sendOfflineHelper.signedTx')"
          number="3"
        >
          <standard-input :options="inputSignedTx" />
          <expending-option title="Raw Transaction">
            <standard-input :options="inputRawTx" class="no-margin" />
          </expending-option>
          <div class="button-container">
            <standard-button :options="buttonUploadJson" />
            <standard-button :options="buttonSendTx" />
          </div>
        </accordion-menu>
      </div>
    </div>

    <confirmation-modal />
  </div>
</template>

<script>
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';
import AccordionMenu2 from '@/components/AccordionMenu2';
import DropDownAddressSelector2 from '@/components/DropDownAddressSelector2';
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';
import ExpendingOption from '@/components/ExpendingOption';
import ConfirmationModal from './components/ConfirmationModal';

export default {
  components: {
    'page-title': TitleTextContentsLayout,
    'accordion-menu': AccordionMenu2,
    'dropdown-address-selector': DropDownAddressSelector2,
    'standard-button': StandardButton,
    'standard-input': StandardInput,
    'expending-option': ExpendingOption,
    'confirmation-modal': ConfirmationModal
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
      buttonContinue: {
        title: 'Continue',
        buttonStyle: 'green',
        noWalletTerms: true,
        rightArrow: true
      },
      buttonSendTx: {
        title: 'Send Transaction',
        buttonStyle: 'green',
        noWalletTerms: true
      },
      buttonUploadJson: {
        title: 'Upload JSON File',
        buttonStyle: 'green-border',
        noWalletTerms: true,
        noMinWidth: true
      },
      inputTxFee: {
        title: this.$t('sendOfflineHelper.txFee'),
        topTextInfo: '0.00031 ($1.34)',
        rightInputText: 'Gwei'
      },
      inputNonce: {
        title: this.$t('sendOfflineHelper.nonce'),
        popover: 'Nonce is Nonce!'
      },
      inputSignedTx: {
        title: this.$t('sendOfflineHelper.signedTx'),
        isTextarea: true,
        buttonClear: true,
        buttonCopy: true
      },
      inputRawTx: {
        isTextarea: true,
        buttonClear: true,
        buttonCopy: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
