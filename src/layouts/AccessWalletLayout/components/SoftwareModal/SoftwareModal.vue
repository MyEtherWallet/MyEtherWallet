<template>
  <b-modal
    ref="software"
    :title="$t('accessWallet.accessBySoftware')"
    hide-footer
    class="bootstrap-modal padding-25-20 modal-software"
    centered
  >
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li
          v-for="(item, idx) in items"
          :key="item.name + idx"
          :class="selected === item.name ? 'selected' : ''"
          @click="select(item.name)"
        >
          <div>
            <img
              :src="selected === item.name ? item.imgHoverPath : item.imgPath"
              class="icon"
            />
            <img :src="item.imgHoverPath" class="hover-icon" />
            <span>{{ item.text }}</span>
          </div>
          <i
            :class="[
              selected === item.name ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </li>
      </ul>
      <input
        ref="jsonInput"
        type="file"
        name="file"
        style="display: none"
        @change="uploadFile"
      />
    </div>
    <div class="not-recommended">
      {{ $t('accessWallet.notARecommendedWay') }}
    </div>
    <div class="button-container">
      <b-btn
        :class="[
          selected !== '' ? 'enabled' : 'disabled',
          'mid-round-button-green-filled'
        ]"
        @click="continueAccess"
      >
        {{ $t('common.continue') }}
      </b-btn>
    </div>
    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byJsonImg from '@/assets/images/icons/button-json.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import byMnemImg from '@/assets/images/icons/button-mnemonic.svg';
import privKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import privKeyImg from '@/assets/images/icons/button-key.svg';

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
      selected: '',
      items: [
        {
          name: 'byJson',
          imgPath: byJsonImg,
          imgHoverPath: byJsonImgHov,
          text: this.$t('common.jsonF')
        },
        {
          name: 'byMnem',
          imgPath: byMnemImg,
          imgHoverPath: byMnemImgHov,
          text: this.$t('common.mnemonicP')
        },
        {
          name: 'byPriv',
          imgPath: privKeyImg,
          imgHoverPath: privKeyImgHov,
          text: this.$t('common.privKey')
        }
      ]
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
@import 'SoftwareModal-desktop.scss';
@import 'SoftwareModal-tablet.scss';
@import 'SoftwareModal-mobile.scss';
</style>
