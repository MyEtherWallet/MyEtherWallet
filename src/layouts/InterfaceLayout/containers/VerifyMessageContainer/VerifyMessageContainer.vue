<template>
  <div class="deploy-contract-container">
    <success-modal 
      message="" 
      link-message="Ok"/>
    <interface-container-title :title="$t('common.verifyMessage')"/>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('common.signature') }}</h4>
          <popover :popcontent="$t('popover.whatIsSignatureContent')"/>
          <div class="copy-buttons">
            <span @click="deleteInputText('abi')">Clear</span>
            <span @click="copyToClipboard('abi')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea 
          ref="abi" 
          class="custom-textarea-1" 
          name=""/>
      </div>
    </div>

    <div class="send-form send-form-small-top-margin">
      <div class="the-form domain-name">
        <input 
          ref="bytecode" 
          type="text" 
          placeholder="Byte code">
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div 
          class="submit-button large-round-button-green-filled clickable" 
          @click="successModalOpen">
          {{ $t('common.verify') }}
        </div>
      </div>
      <interface-bottom-text 
        :link-text="$t('interface.learnMore')" 
        :question="$t('interface.haveIssues')" 
        link="/"/>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import SuccessModal from '@/components/SuccessModal';

export default {
  name: 'Interact',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal
  },
  data() {
    return {
      showModal: true,
      existingContracts: [
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '1'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '2'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '3'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '4'
        }
      ]
    };
  },
  watch: {
    showModal() {
      if (this.showModal === false) {
        this.showModal = true;
      }
    }
  },
  methods: {
    successModalOpen() {
      this.$children[0].$refs.success.show();
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInputText(ref) {
      this.$refs[ref].value = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageContainer.scss';
</style>
