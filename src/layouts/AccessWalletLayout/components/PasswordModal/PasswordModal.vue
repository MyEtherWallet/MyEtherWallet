<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered>
    <div class="password-modal-content">
      <form class="password-form">
        <div class="input-container">
          <input
            :type="show ? 'text': 'password'"
            v-model="password"
            name="Password"
            autocomplete="off" >
          <img
            v-if="show"
            src="@/assets/images/icons/show-password.svg"
            @click.prevent="switchViewPassword">
          <img
            v-if="!show"
            src="@/assets/images/icons/hide-password.svg"
            @click.prevent="switchViewPassword">
        </div>

        <div class="terms-container">
          <accept-terms-checker @click="needToAcceptTerms = !needToAcceptTerms"/>
        </div>

        <p
          v-show="error !== ''"
          class="error"> {{ error }} </p>

        <div class="password-modal-button-container">
          <standard-button
            :disabled="continueUnlock"
            @click="unlockWallet"
          >
            {{ $t("accessWallet.unlockWallet") }}
          </standard-button>
        </div>


        <customer-support/>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { BasicWallet } from '@/wallets';
import Worker from 'worker-loader!@/workers/unlockWallet.worker.js';
import AcceptTermsChecker from '@/components/AcceptTermsChecker';
import CustomerSupport from '@/components/CustomerSupport';

export default {
  components: {
    'accept-terms-checker': AcceptTermsChecker,
    'customer-support': CustomerSupport
  },
  props: {
    file: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      needToAcceptTerms: true,
      buttonAccessMyWallet: {
        title: 'Access My Wallet',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      buttonDisabled: {
        title: 'Access My Wallet',
        buttonStyle: 'grey',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      show: false,
      password: '',
      error: ''
    };
  },
  computed: {
    continueUnlock() {
      if (
        this.password === '' &&
        this.password.length === 0 &&
        this.password.length < 9
      ) {
        return true;
      } else if (this.needToAcceptTerms) {
        return true;
      }
      return false;
    }
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  mounted() {
    //this.$refs.password.show();
  },
  methods: {
    unlockWallet() {
      const worker = new Worker();
      const self = this;
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = function(e) {
        // Regenerate the wallet since the worker only return an object instance. Not the whole wallet instance
        self.$store.dispatch(
          'decryptWallet',
          BasicWallet.unlock({
            type: 'manualPrivateKey',
            manualPrivateKey: Buffer.from(e.data._privKey).toString('hex')
          })
        );
        self.$router.push({ path: 'interface' });
      };
      worker.onerror = function(e) {
        self.error = e.message;
      };
    },
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PasswordModal.scss';
</style>
