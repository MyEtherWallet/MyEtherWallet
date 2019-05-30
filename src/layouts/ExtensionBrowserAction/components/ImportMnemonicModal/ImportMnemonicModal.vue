<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.accessByMnemonicPhrase')"
    hide-footer
    class="bootstrap-modal padding-20"
    centered
  >
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
                v-model="locMnemonicPhrase[index - 1]"
                :ref="`mnemonicInput${index - 1}`"
                type="text"
                name=""
              />
            </li>
          </ul>
        </div>
        <div class="not-recommended">
          {{ $t('accessWallet.notARecommendedWay') }}
        </div>
        <div class="button-container">
          <b-btn
            class="mid-round-button-green-filled close-button"
            type="submit"
            @click.prevent="openAddressOption"
          >
            <span v-show="!loading"> {{ $t('common.continue') }} </span>
            <i v-show="loading" class="fa fa-spin fa-spinner fa-lg" />
          </b-btn>
        </div>
      </form>
    </div>

    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  props: {
    openAddressOption: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locMnemonicPhrase: new Array(this.mnemonicSize).fill(''),
      mnemonic24: false,
      mnemonicSize: 12
    };
  },
  watch: {
    locMnemonicPhrase(newVal) {
      if (newVal[0] !== ' ' && newVal[0].indexOf(' ') >= 0) {
        if (
          newVal[0].split(' ').length === 12 ||
          newVal[0].split(' ').length === 24
        ) {
          this.mnemonicSize = newVal[0].split(' ').length;
          this.mnemonic24 = this.mnemonicSize === 24;
          this.locMnemonicPhrase = newVal[0].split(' ');
        }
      }
      this.$emit('mnemonicPhrase', newVal);
    }
  },
  methods: {
    mnemonicValueBitSizeChange() {
      this.mnemonic24 = !this.mnemonic24;
      this.mnemonic24 ? (this.mnemonicSize = 24) : (this.mnemonicSize = 12);
      this.locMnemonicPhrase = new Array(this.mnemonicSize).fill('');
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ImportMnemonicModal.scss';
</style>
