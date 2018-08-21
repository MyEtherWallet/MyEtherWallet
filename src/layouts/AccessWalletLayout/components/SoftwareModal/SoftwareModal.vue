<template>
  <b-modal
    ref="software"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    title="Access by Software">
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li
          :class="selected === 'byJson'? 'selected': ''"
          @click="select('byJson')">
          <img
            :src="selected === 'byJson'? require('@/assets/images/icons/button-json-hover.svg'):require('@/assets/images/icons/button-json.svg')"
            class="icon">
          <span>{{ $t("common.jsonF") }}</span>
        </li>
        <li
          :class="selected === 'byMnem'? 'selected': ''"
          @click="select('byMnem')">
          <img
            :src="selected === 'byMnem'? require('@/assets/images/icons/button-mnemonic-hover.svg'):require('@/assets/images/icons/button-mnemonic.svg')"
            class="icon">
          <span>{{ $t("common.mnemonicP") }}</span>
        </li>
        <li
          :class="selected === 'byPriv'? 'selected': ''"
          @click="select('byPriv')">
          <img
            :src="selected === 'byPriv'? require('@/assets/images/icons/button-key-hover.svg'):require('@/assets/images/icons/button-key.svg')"
            class="icon">
          <span>{{ $t("common.privKey") }}</span>
        </li>
      </ul>
      <input
        ref="jsonInput"
        type="file"
        name="file"
        style="display: none"
        @change="uploadFile" >
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
      let jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    continueAccess() {
      if (this.selected === 'byJson') {
        this.uploadClick();
      } else if (this.selected === 'byPriv') {
        this.openPrivateKeyInput();
      } else {
        // eslint-disable-next-line
        console.log("")
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
      let reader = new FileReader();
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
