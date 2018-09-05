<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('common.interactWcontract')"/>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.contractAddr') }}</h4>
          <div class="select-contract no-border">
            <currency-picker 
              :currency="existingContracts" 
              :token="false" 
              page="interactWContract"/>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <input 
          type="text" 
          name="" 
          value="" 
          placeholder="Enter Domain Name or Address" >
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.abiJsonInt') }}</h4>
          <div class="copy-buttons">
            <span @click="clearInputValues('abi-json-interface')">{{ $t('common.clear') }}</span>
            <span @click="copyToClipboard('abi-json-interface')">{{ $t('common.copy') }}</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea 
          ref="abi-json-interface" 
          class="custom-textarea-1" 
          name=""/>
      </div>
    </div>

    <div class="submit-button-container">
      <!-- <router-link :to="{ name: 'InteractWithContract', params: {} }"> -->
      <div class="submit-button large-round-button-green-filled clickable">
        {{ $t('common.continue') }}
        <i 
          class="fa fa-long-arrow-right" 
          aria-hidden="true"/>
      </div>
      <!-- </router-link> -->
      <interface-bottom-text 
        :link-text="$t('interface.learnMore')" 
        :question="$t('interface.haveIssues')" 
        link="/"/>
    </div>

  </div>
</template>

<script>
import CurrencyPicker from "../../components/CurrencyPicker";
import InterfaceContainerTitle from "../../components/InterfaceContainerTitle";
import InterfaceBottomText from "@/components/InterfaceBottomText";

export default {
  components: {
    "interface-container-title": InterfaceContainerTitle,
    "interface-bottom-text": InterfaceBottomText,
    "currency-picker": CurrencyPicker
  },
  data() {
    return {
      existingContracts: [
        {
          name: "Battle Of Thermopy wefweoifjwfo ewrofijweo",
          value: "1"
        },
        {
          name: "Battle Of Thermopy wefweoifjwfo ewrofijweo g",
          value: "2"
        },
        {
          name: "Battle Of Thermopy wefweoifjwfo ewrofijweo gf",
          value: "3"
        },
        {
          name: "Battle Of Thermopy wefweoifjwfo ewrofijw",
          value: "4"
        }
      ]
    };
  },
  methods: {
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand("copy");
    },
    clearInputValues(ref) {
      this.$refs[ref].value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "InteractWithContractContainer.scss";
</style>
