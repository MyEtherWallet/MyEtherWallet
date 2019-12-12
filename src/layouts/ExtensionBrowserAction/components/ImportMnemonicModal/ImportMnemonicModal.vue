<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.mnemonic.modal.title')"
    hide-footer
    class="bootstrap-modal padding-20"
    centered
    static
  >
    <div class="contents">
      <p class="instruction">
        {{ $t('accessWallet.please-type-in-mnemonic-phrase') }}
      </p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input ref="checkyboi" type="checkbox" />
              <span class="slider round" @click="mnemonicValueBitSizeChange" />
            </label>
            <div class="labels">
              <span
                :class="[
                  locMnemonicPhrase.length <= 12 ? 'white' : '',
                  'label-left'
                ]"
                >12</span
              >
              <span
                :class="[
                  locMnemonicPhrase.length > 12 ? 'white' : '',
                  'label-right'
                ]"
                >24</span
              >
            </div>
          </div>
          <span class="text__base link switch-label">{{
            $t('mewcx.value')
          }}</span>
        </div>
      </div>
      <form>
        <div class="phrases">
          <ul>
            <li v-for="index in mnemonicSize" :key="index">
              <span>{{ index }}.</span>
              <input
                :ref="`mnemonicInput${index - 1}`"
                v-model="locMnemonicPhrase[index - 1]"
                type="text"
                name=""
              />
            </li>
          </ul>
        </div>
        <div class="button-container">
          <expanding-option :title="$t('mewcx.password')">
            <div class="input-container">
              <div class="mnemonic-password-input">
                <input
                  v-model="locPassword"
                  :type="show ? 'text' : 'password'"
                  :placeholder="$t('mewcx.enter-pw')"
                />
                <img
                  :src="show ? showIcon : hide"
                  @click.prevent="show = !show"
                />
              </div>
            </div>
          </expanding-option>
          <div>
            <b-btn
              :class="[hasEmpty ? 'disabled' : '', 'mnemonic-submit']"
              type="submit"
              @click.prevent="openAddressOption"
            >
              <span v-show="!loading"> {{ $t('common.continue') }} </span>
              <i v-show="loading" class="fa fa-spin fa-spinner fa-lg" />
            </b-btn>
          </div>
        </div>
      </form>
    </div>

    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import ExpandingOption from '@/components/ExpandingOption';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';

export default {
  components: {
    'customer-support': CustomerSupport,
    'expanding-option': ExpandingOption
  },
  props: {
    openAddressOption: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locMnemonicPhrase: new Array(this.mnemonicSize).fill(''),
      mnemonicSize: 12,
      isTwelve: true,
      show: false,
      locPassword: this.password,
      hide: hide,
      showIcon: showIcon
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
        if (this.mnemonicSize !== length) this.$refs.checkyboi.click();
        if (length === 12 || length === 24) {
          this.mnemonicSize = length;
          this.locMnemonicPhrase = newVal[0].split(' ');
        }
      }
      this.$emit('mnemonicPhrase', newVal);
    },
    locPassword(newVal) {
      this.$emit('passwordUpdated', newVal);
    }
  },
  mounted() {
    this.$refs.mnemonicPhrase.$on('hidden', () => {
      this.locMnemonicPhrase = new Array(this.mnemonicSize).fill('');
      this.locPassword = '';
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
