<template>
  <div class="modal-container">
    <p @click="openModal">Confirmation Modal Open</p>
    <b-modal
      ref="confirmation"
      title="Confirmation"
      hide-footer
      centered
      class="bootstrap-modal network nopadding max-height-1">
      <div class="modal-content-block">
        <div class="form-block">
          <dropdown-address-selector :options="addressSelector" />
        </div>
        <div class="form-block">
          <standard-input :options="inputMessage" />
        </div>
        <div class="button-block">
          <div class="qrcode-button">
            <standard-button 
              :options="buttonConfirm"
              @click.native="successModalOpen"
            />
            <qrcode-button :options="QRCodeButton" />
          </div>
          
          <interface-bottom-text
            :link-text="$t('interface.learnMore')"
            :question="$t('interface.haveIssues')"
            link="/"/>
        </div>        
      </div>      
    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';

export default {
  components: {
    'dropdown-address-selector': DropDownAddressSelector,
    'interface-bottom-text': InterfaceBottomText,
    'qrcode-button': ButtonWithQrCode
  },
  data() {
    return {
      QRCodeButton: {},
      buttonConfirm: {
        title: 'Confirm Signing',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      },
      addressSelector: {
        title: 'To Address',
        buttonCopy: false,
        buttonClear: false,
        popover: '',
        value: '0x7545566a4339daf3fad6979208b2042f06e8c881',
        inputDisabled: true,
        placeholder: 'Type in Address'
      },
      inputMessage: {
        title: 'Message',
        value: 'hahahahaha Great!',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        isTextarea: true,
        inputDisabled: true
      }
    };
  },
  mounted() {},
  methods: {
    openModal() {
      this.$refs.confirmation.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceConfirmationModal.scss';
</style>
