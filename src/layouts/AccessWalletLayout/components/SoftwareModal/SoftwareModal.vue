<template>
  <b-modal
    ref="software"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    title="Access by Software">
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li @click="select('byJson')" :class="selected === 'byJson'? 'selected': ''">
          <img class="icon" :src="selected === 'byJson'? require('@/assets/images/icons/button-json-hover.svg'):require('@/assets/images/icons/button-json.svg')">
          <img class="hover-icon" src="@/assets/images/icons/button-json-hover.svg">
          <span>{{ $t("common.jsonF") }}</span>
        </li>
        <li @click="select('byMnem')" :class="selected === 'byMnem'? 'selected': ''">
          <img class="icon" :src="selected === 'byMnem'? require('@/assets/images/icons/button-mnemonic-hover.svg'):require('@/assets/images/icons/button-mnemonic.svg')">
          <img class="hover-icon" src="@/assets/images/icons/button-mnemonic-hover.svg">
          <span>{{$t("common.mnemonicP")}}</span>
        </li>
        <li @click="select('byPriv')" :class="selected === 'byPriv'? 'selected': ''">
          <img class="icon" :src="selected === 'byPriv'? require('@/assets/images/icons/button-key-hover.svg'):require('@/assets/images/icons/button-key.svg')">
          <img class="hover-icon" src="@/assets/images/icons/button-key-hover.svg">
          <span>{{$t("common.privKey")}}</span>
        </li>
      </ul>
      <input
        ref="jsonInput"
        type="file"
        name="file"
        style="display: none"
        @change="uploadFile">
    </div>
    <div class="button-container">
      <b-btn
        :class="[selected !== ''? 'enabled': 'disabled','mid-round-button-green-filled']"
        @click="continueAccess">
        {{ $t("common.continue") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t("common.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    openPassword: {
      type: Function,
      default: function() {}
    },
    openMnemonicPhraseInput: {
      type: Function,
      default: function() {}
    },
    openPrivateKeyInput: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      file: '',
      selected: ''
    };
  },
  methods: {
    uploadClick() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    continueAccess() {
      if (this.selected === 'byJson') {
        this.uploadClick();
      } else if (this.selected === 'byPriv') {
        this.openPrivateKeyInput();
      } else if (this.selected === 'byMnem') {
        this.openMnemonicPhraseInput();
      }
    },
    select(ref) {
      if (this.selected !== ref) {
        this.selected = ref;
      } else {
        this.selected = '';
      }
    },
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        self.$emit('file', JSON.parse(evt.target.result));
        self.file = JSON.parse(evt.target.result);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SoftwareModal.scss';
</style>
