<template>
  <b-modal
    ref="software"
    :title="$t('accessWallet.accessBySoftware')"
    hide-footer
    class="bootstrap-modal padding-25-20 modal-software"
    centered>
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li
          :class="selected === 'byJson'? 'selected': ''"
          @click="select('byJson')">
          <img
            :src="selected === 'byJson'? require('@/assets/images/icons/button-json-hover.svg'):require('@/assets/images/icons/button-json.svg')"
            class="icon">
          <img
            class="hover-icon"
            src="@/assets/images/icons/button-json-hover.svg">
          <span>{{ $t("common.jsonF") }}</span>
        </li>
        <li
          :class="selected === 'byMnem'? 'selected': ''"
          @click="select('byMnem')">
          <img
            :src="selected === 'byMnem'? require('@/assets/images/icons/button-mnemonic-hover.svg'):require('@/assets/images/icons/button-mnemonic.svg')"
            class="icon">
          <img
            class="hover-icon"
            src="@/assets/images/icons/button-mnemonic-hover.svg">
          <span>{{ $t("common.mnemonicP") }}</span>
        </li>
        <li
          :class="selected === 'byPriv'? 'selected': ''"
          @click="select('byPriv')">
          <img
            :src="selected === 'byPriv'? require('@/assets/images/icons/button-key-hover.svg'):require('@/assets/images/icons/button-key.svg')"
            class="icon">
          <img
            class="hover-icon"
            src="@/assets/images/icons/button-key-hover.svg">
          <span>{{ $t("common.privKey") }}</span>
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
    <customer-support/>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';

export default {
  components: {
    'customer-support': CustomerSupport
  },
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
      this.selected = ref;
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
