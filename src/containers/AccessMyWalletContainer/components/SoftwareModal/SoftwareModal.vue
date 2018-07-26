<template>
  <b-modal ref="software" hide-footer class="bootstrap-modal modal-software" centered title="Access by Software">
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li @click="select('byJson')" :class="selected === 'byJson'? 'selected': ''">
          <img class="icon" :src="selected === 'byJson'? require('@/assets/images/icons/button-json-hover.svg'):require('@/assets/images/icons/button-json.svg')">
          <span>{{ $t("reused.jsonF") }}</span>
        </li>
        <li @click="select('byMnem')" :class="selected === 'byMnem'? 'selected': ''">
          <img class="icon" :src="selected === 'byMnem'? require('@/assets/images/icons/button-mnemonic-hover.svg'):require('@/assets/images/icons/button-mnemonic.svg')">
          <span>{{$t("reused.mnemonicP")}}</span>
        </li>
        <li @click="select('byPriv')" :class="selected === 'byPriv'? 'selected': ''">
          <img class="icon" :src="selected === 'byPriv'? require('@/assets/images/icons/button-key-hover.svg'):require('@/assets/images/icons/button-key.svg')">
          <span>{{$t("reused.privKey")}}</span>
        </li>
      </ul>
      <input type="file" name="file" style="display: none" ref="jsonInput" @change="uploadedFile" />
    </div>
    <div class="button-container">
      <b-btn :class="[selected !== ''? '': 'disabled','mid-round-button-green-filled']" @click="continueAccess">
        {{ $t("reused.continue") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{$t("reused.customerSupport")}}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['value', 'openPassword', 'openPrivateKeyInput'],
  data () {
    return {
      file: '',
      selected: ''
    }
  },
  methods: {
    uploadClick () {
      let jsonInput = this.$refs.jsonInput
      if (this.file === '') {
        jsonInput.click()
      } else {
        this.openPassword()
      }
    },
    continueAccess () {
      if (this.selected === 'byJson') {
        this.uploadClick()
      } else if (this.selected === 'byPriv') {
        this.openPrivateKeyInput()
      } else {

      }
    },
    select (ref) {
      if (this.selected !== ref) {
        this.selected = ref
      } else {
        this.selected = ''
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
