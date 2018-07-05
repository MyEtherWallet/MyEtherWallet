<template>
  <b-modal ref="software" hide-footer class="bootstrap-modal modal-software" title="Access by Software">
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li @click="uploadClick">
          <img class="icon" src="~@/assets/images/icons/button-json.svg">
          <img class="icon-hover" src="~@/assets/images/icons/button-json-hover.svg">
          <span>{{ $t("reused.jsonF") }}</span>
        </li>
        <li>
          <img class="icon" src="~@/assets/images/icons/button-mnemonic.svg">
          <img class="icon-hover" src="~@/assets/images/icons/button-mnemonic-hover.svg">
          <span>{{$t("reused.mnemonicP")}}</span>
        </li>
        <li>
          <img class="icon" src="~@/assets/images/icons/button-key.svg">
          <img class="icon-hover" src="~@/assets/images/icons/button-key-hover.svg">
          <span>{{$t("reused.privKey")}}</span>
        </li>
      </ul>
      <input type="file" name="file" style="display: none" id="jsonInput" @change="uploadedFile" />
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("reused.continue") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
          <div class="support-label"><h5>{{$t("reused.customerSupport")}}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['value', 'openPassword'],
  data () {
    return {
      file: ''
    }
  },
  methods: {
    uploadClick () {
      let jsonInput = document.getElementById('jsonInput')
      if (this.file === '') {
        jsonInput.click()
      } else {
        this.openPassword()
      }
    },
    uploadedFile (e) {
      const self = this
      let reader = new FileReader()
      reader.onloadend = function (evt) {
        self.$emit('file', JSON.parse(evt.target.result))
        self.file = JSON.parse(evt.target.result)
      }
      reader.readAsBinaryString(e.target.files[0])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SoftwareModal.scss";
</style>
