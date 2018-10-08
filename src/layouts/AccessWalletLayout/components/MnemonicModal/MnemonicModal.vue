<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.accessByMnemonicPhrase')"
    hide-footer
    class="bootstrap-modal padding-20 modal-metamask"
    centered>

    <div class="contents">
      <p class="instruction">{{ $t("accessWallet.pleaseTypeInMnemonicPhrase") }}</p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input type="checkbox">
              <span
                class="slider round"
                @click="mnemonicValueBitSizeChange"/>
            </label>
            <div class="labels">
              <span class="label-left white">12</span>
              <span class="label-right">24</span>
            </div>
          </div>
          <span class="text__base link switch-label">{{ $t("createWallet.byMnemonicValue") }}</span>
        </div>

      </div>
      <div class="phrases">
        <ul>
          <li
            v-for="index in mnemonicSize"
            :key="index">
            <span>{{ index }}.</span><input
              :id="'word' + (index - 1)"
              v-model="mnemonicPhrase[index - 1]"
              type="text"
              name="">
          </li>
        </ul>
      </div>
    </div>

    <div class="button-container">
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="openPasswordModal">
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
    mnemonicPhrasePasswordModalOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      mnemonicPhrase: [].fill(' ', 0, 11),
      mnemonic24: false,
      mnemonicSize: 12
    };
  },
  methods: {
    mnemonicValueBitSizeChange() {
      const left = document.querySelector('.label-left');
      const right = document.querySelector('.label-right');
      this.mnemonic24 = !this.mnemonic24;
      if (this.mnemonic24 === true) {
        this.mnemonicSize = 24;
        this.mnemonicPhrase.fill(' ', 12, this.mnemonicSize);
        left.classList.remove('white');
        right.classList.add('white');
      } else {
        this.mnemonicSize = 12;
        this.mnemonicPhrase.splice(12, 12);
        left.classList.add('white');
        right.classList.remove('white');
      }
    },
    openPasswordModal() {
      this.mnemonicPhrasePasswordModalOpen(this.mnemonicPhrase.join(' '));
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicModal-desktop.scss';
@import 'MnemonicModal-tablet.scss';
@import 'MnemonicModal-mobile.scss';
</style>
