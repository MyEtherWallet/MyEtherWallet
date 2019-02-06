<template>
  <div class="send-offline-helper">
    <div class="wrap">
      <div class="page-container">
        <div class="page-header">
          <h2>Send Offline Helper</h2>
          <p>
            Customize actions, debug reveals, and more with this set of advance
            tools. Please be mindful of the capabilities and limitations of
            these tools before using.
          </p>
        </div>
        <div class="accordion-container">
          <!-- Accordion 1 ==================================== -->
          <!-- Accordion 1 ==================================== -->
          <!-- Accordion 1 ==================================== -->
          <accordion-menu
            :open="accordionOpen1"
            number="1"
            title="Generate Information"
          >
            <dropdown-address-selector title="From Address" />
            <div class="buttons">
              <standard-button :options="genInfoButton" />
            </div>
          </accordion-menu>

          <!-- Accordion 2 ==================================== -->
          <!-- Accordion 2 ==================================== -->
          <!-- Accordion 2 ==================================== -->
          <accordion-menu
            :open="accordionOpen2"
            number="2"
            title="Nonce and Transaction Fee"
          >
            <standard-input :options="txFeeInput" class="user-input" />
            <standard-input :options="nonceInput" class="user-input" />
            <div class="buttons">
              <standard-button :options="genInfoButton" />
            </div>
          </accordion-menu>

          <!-- Accordion 3 ==================================== -->
          <!-- Accordion 3 ==================================== -->
          <!-- Accordion 3 ==================================== -->
          <accordion-menu
            :open="accordionOpen3"
            number="3"
            title="Signed Transaction"
          >
            <standard-input :options="signTx" class="user-input" />
            <expending-options title="Raw Transaction">
              <standard-input :options="rawTx" />
            </expending-options>
            <div class="buttons">
              <standard-button
                :options="uploadJsonButton"
                class="mobile-margin-bottom"
              />
              <standard-button :options="sendTxButton" />
            </div>
          </accordion-menu>
        </div>
      </div>
    </div>
    <confirmation-modal />
  </div>
</template>

<script>
import AccordionMenu from '@/components/AccordionMenu';
import StandardInput from '@/components/StandardInput';
import StandardButton from '@/components/Buttons/StandardButton';
import ExpendingOptions from '@/components/ExpendingOptions';
import DropDownAddressSelector from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapAddressSelector';
import ConfirmationModal from './components/ConfirmationModal';

export default {
  components: {
    'accordion-menu': AccordionMenu,
    'standard-input': StandardInput,
    'standard-button': StandardButton,
    'expending-options': ExpendingOptions,
    'dropdown-address-selector': DropDownAddressSelector,
    'confirmation-modal': ConfirmationModal
  },
  data() {
    return {
      accordionOpen1: true,
      accordionOpen2: true,
      accordionOpen3: true,
      genInfoButton: {
        title: 'Continue',
        buttonStyle: 'green',
        rightArrow: true,
        checkbox: false
      },
      txFeeNonceButton: {
        title: 'Continue',
        buttonStyle: 'green',
        rightArrow: true,
        checkbox: false
      },
      uploadJsonButton: {
        title: 'Upload JSON File',
        buttonStyle: 'green-border',
        checkbox: false,
        noMinWidth: true
      },
      sendTxButton: {
        title: 'Send Transaction',
        buttonStyle: 'green',
        checkbox: false
      },
      txFeeInput: {
        title: 'Transaction Fee',
        rightInputText: 'Gwei',
        topTextInfo: '0.02311 ETH ($1.23)'
      },
      nonceInput: {
        title: 'Nonce',
        popover: 'Nonce'
      },
      signTx: {
        title: 'Signed Transaction',
        isTextarea: true,
        buttonCopy: true,
        buttonClear: true
      },
      rawTx: {
        isTextarea: true,
        buttonCopy: true,
        buttonClear: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelperLayout.scss';
</style>
