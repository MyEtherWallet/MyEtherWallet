<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.accessByMnemonicPhrase')"
    hide-footer
    class="bootstrap-modal modal-metamask nopadding"
    centered
    @shown="focusInput"
  >
    <div class="warning">
      <warning-message :options="warningOptions" />
    </div>
    <div class="contents">
      <p class="instruction">
        {{ $t('accessWallet.pleaseTypeInMnemonicPhrase') }}
      </p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round" @click="mnemonicValueBitSizeChange" />
            </label>
            <div class="labels">
              <span :class="[!mnemonic24 ? 'white' : '', 'label-left']"
                >12</span
              >
              <span :class="[mnemonic24 ? 'white' : '', 'label-right']"
                >24</span
              >
            </div>
          </div>
          <span class="text__base link switch-label">{{
            $t('createWallet.byMnemonicValue')
          }}</span>
        </div>
      </div>
      <form>
        <div class="phrases">
          <ul>
            <li v-for="index in mnemonicSize" :key="index">
              <span>{{ index }}.</span>
              <input
                v-model="mnemonicPhrase[index - 1]"
                :ref="`mnemonicInput${index - 1}`"
                type="text"
                name=""
              />
            </li>
          </ul>
        </div>
        <div class="button-container-block">
          <standard-button
            :options="continueButtonOptions"
            @click.native="openPasswordModal"
          />
        </div>
      </form>
      <customer-support />
    </div>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import WarningMessage from '@/components/WarningMessage';
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'customer-support': CustomerSupport,
    'warning-message': WarningMessage,
    'standard-button': StandardButton
  },
  props: {
    mnemonicPhrasePasswordModalOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      continueButtonOptions: {
        title: this.$t('common.continue'),
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      },
      warningOptions: {
        title: 'NOT RECOMMENDED',
        message: this.$t('accessWallet.notARecommendedWay'),
        link: {
          text: 'Using MEW Offline',
          url: 'https://kb.myetherwallet.com/posts/offline/using-mew-offline/'
        }
      },
      mnemonicPhrase: new Array(this.mnemonicSize).fill(''),
      mnemonic24: false,
      mnemonicSize: 12
    };
  },
  watch: {
    mnemonicPhrase(newVal) {
      if (newVal[0] !== ' ' && newVal[0].indexOf(' ') >= 0) {
        if (
          newVal[0].split(' ').length === 12 ||
          newVal[0].split(' ').length === 24
        ) {
          this.mnemonic24 = newVal[0].split(' ').length === 24;
          this.mnemonicSize = newVal[0].split(' ').length;
          this.mnemonicPhrase = newVal[0].split(' ');
        }
      }
    }
  },
  methods: {
    mnemonicValueBitSizeChange() {
      this.mnemonic24 = !this.mnemonic24;
      this.mnemonic24 ? (this.mnemonicSize = 24) : (this.mnemonicSize = 12);
      this.mnemonicPhrase = new Array(this.mnemonicSize).fill('');
    },
    openPasswordModal() {
      this.mnemonicPhrasePasswordModalOpen(this.mnemonicPhrase.join(' '));
    },
    focusInput() {
      this.$refs.mnemonicInput0[0].focus();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicModal-desktop.scss';
@import 'MnemonicModal-tablet.scss';
@import 'MnemonicModal-mobile.scss';
</style>
