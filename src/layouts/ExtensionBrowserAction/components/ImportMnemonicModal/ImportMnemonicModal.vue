<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.accessByMnemonicPhrase')"
    hide-footer
    class="bootstrap-modal padding-20"
    centered
    static
  >
    <div class="contents">
      <p class="instruction">
        {{ $t('accessWallet.pleaseTypeInMnemonicPhrase') }}
      </p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input ref="checkyboi" type="checkbox"/>
              <span class="slider round" @click="mnemonicValueBitSizeChange" />
            </label>
            <div class="labels">
              <span :class="[locMnemonicPhrase.length <= 12 ? 'white' : '', 'label-left']"
                >12</span
              >
              <span :class="[locMnemonicPhrase.length > 12 ? 'white' : '', 'label-right']"
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
        <div class="button-container">
          <b-btn
            :class="[hasEmpty ? 'disabled' : '', 'mnemonic-submit']"
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
      mnemonicSize: 12,
      isTwelve: true
    };
  },
  computed: {
    hasEmpty() {
      return this.locMnemonicPhrase.includes('');
    }
  },
  watch: {
    locMnemonicPhrase(newVal) {
      if (newVal[0] !== ' ' && newVal[0].indexOf(' ') >= 0) {
        const length = newVal[0].split(' ').length;
        if (this.mnemonicSize !== length)
          this.$refs.checkyboi.click();
        if (
          length === 12 ||
          length === 24
        ) {
          this.mnemonicSize = length;
          this.locMnemonicPhrase = newVal[0].split(' ');
        }
      }
      this.$emit('mnemonicPhrase', newVal);
    }
  },
  mounted() {
    this.$refs.mnemonicPhrase.$on('hidden', () => {
      this.locMnemonicPhrase = new Array(this.mnemonicSize).fill('');
    });
  },
  methods: {
    mnemonicValueBitSizeChange() {
      this.mnemonicSize = this.mnemonicSize === 12 ? 24 : 12;
      this.locMnemonicPhrase = new Array(this.mnemonicSize).fill('');
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ImportMnemonicModal.scss';
</style>
