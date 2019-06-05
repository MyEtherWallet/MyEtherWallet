<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    @shown="focusInput"
  >
    <form class="password-form">
      <div class="input-container">
        <input
          ref="passwordInput"
          :type="show ? 'text' : 'password'"
          v-model="password"
          name="Password"
          autocomplete="off"
          placeholder="Enter password"
        />
        <img
          v-if="show"
          src="@/assets/images/icons/show-password.svg"
          @click.prevent="switchViewPassword"
        />
        <img
          v-if="!show"
          src="@/assets/images/icons/hide-password.svg"
          @click.prevent="switchViewPassword"
        />
      </div>
      <!-- <div class="not-recommended">
        {{ $t('accessWallet.notARecommendedWay') }}
      </div> -->
      <button
        :disabled="
          password === '' && password.length === 0 && password.length < 9
        "
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet"
      >
        <span v-show="!spinner">{{ $t('common.accessWallet') }}</span>
        <i v-show="spinner" class="fa fa-spin fa-spinner fa-lg" />
      </button>
    </form>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import _worker from 'worker-loader!@/workers/wallet.worker.js';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
export default {
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
      show: false,
      password: '',
      spinner: false
    };
  },
  computed: {
    ...mapGetters({
      path: 'path'
    })
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    unlockWallet() {
      this.spinner = true;
      const worker = new _worker();
      const self = this;
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = function(e) {
        // Regenerate the wallet since the worker only return an object instance. Not the whole wallet instance
        self.$store.dispatch('decryptWallet', [
          new WalletInterface(Buffer.from(e.data._privKey), false, keyStoreType)
        ]);
        self.spinner = false;
        this.password = '';
        self.$router.push({
          path: 'interface'
        });
      };
      worker.onerror = function(e) {
        e.preventDefault();
        self.spinner = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    switchViewPassword() {
      this.show = !this.show;
    },
    focusInput() {
      this.password = '';
      this.$refs.passwordInput.focus();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PasswordModal.scss';
</style>
