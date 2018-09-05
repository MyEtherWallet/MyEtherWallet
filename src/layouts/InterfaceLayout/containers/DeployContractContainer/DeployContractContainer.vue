<template>
  <div class="deploy-contract-container">
    <success-modal 
      message="" 
      link-message="Ok"/>
    <interface-container-title :title="$t('common.depContract')"/>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Byte Code</h4>
          <div class="copy-buttons">
            <span @click="deleteInput('bytecode')">Clear</span>
            <span @click="copyToClipboard('bytecode')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <input 
          ref="bytecode" 
          type="text" 
          placeholder="Byte code" 
          autocomplete="off" >
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>ABI/JSON Interface</h4>
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

    <div class="send-form2">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>Speed of Transaction</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>Transcation Fee: 0.000013 ETH ($1.234)</p>
        </div>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            Slow
          </div>
          <div class="small-circle-button-green-border active">
            Regular
          </div>
          <div class="small-circle-button-green-border">
            Fast
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input 
          type="number" 
          name="" 
          value="" 
          placeholder="Gas Amount" >
        <div class="good-button-container">
          <p>Gwei</p>
          <i 
            class="fa fa-check-circle good-button not-good" 
            aria-hidden="true"/>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div class="submit-button large-round-button-green-border clickable">
          {{ $t('common.continue') }}
        </div>
        <div 
          class="submit-button large-round-button-green-filled clickable" 
          @click="successModalOpen">
          {{ $t('interface.read') }}
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
import InterfaceBottomText from "@/components/InterfaceBottomText";
import InterfaceContainerTitle from "../../components/InterfaceContainerTitle";
import SuccessModal from "@/components/SuccessModal";

export default {
  name: "Interact",
  components: {
    "interface-bottom-text": InterfaceBottomText,
    "interface-container-title": InterfaceContainerTitle,
    "success-modal": SuccessModal
  },
  data() {
    return {
      showModal: true,
      existingContracts: [
        {
          label: "Battle Of Thermopy wefweoifjwfo ewrofijweo gf",
          value: "1"
        },
        {
          label: "Battle Of Thermopy wefweoifjwfo ewrofijweo gf",
          value: "2"
        },
        {
          label: "Battle Of Thermopy wefweoifjwfo ewrofijweo gf",
          value: "3"
        },
        {
          label: "Battle Of Thermopy wefweoifjwfo ewrofijweo gf",
          value: "4"
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
      document.execCommand("copy");
    },
    deleteInput(ref) {
      this.$refs[ref].value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "DeployContractContainer.scss";
</style>
