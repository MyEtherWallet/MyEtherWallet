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
      <div class="not-recommended">
        {{ $t('accessWallet.notARecommendedWay') }}
      </div>
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
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { mapGetters } from 'vuex';
import { Toast, Wallet } from '@/helpers';
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
      path: 'path',
      online: 'online'
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

      if (this.online && window.Worker) {
        const worker = new walletWorker();
        const self = this;
        worker.postMessage({
          type: 'unlockWallet',
          data: [this.file, this.password]
        });
        worker.onmessage = function(e) {
          self.setUnlockedWallet(
            new WalletInterface(
              Buffer.from(e.data._privKey),
              false,
              keyStoreType
            )
          );
        };
        worker.onerror = function(e) {
          e.preventDefault();
          self.spinner = false;
          Toast.responseHandler(e, Toast.ERROR);
        };
      } else {
        const newFile = {};
        Object.keys(this.file).forEach(key => {
          newFile[key.toLowerCase()] = this.file[key];
        });
        const _wallet = Wallet.fromV3(newFile, this.password, true);
        this.setUnlockedWallet(
          new WalletInterface(
            Buffer.from(_wallet._privKey),
            false,
            keyStoreType
          )
        );
      }
    },
    setUnlockedWallet(wallet) {
      this.$store.dispatch('decryptWallet', [wallet]);
      this.spinner = false;
      this.password = '';
      this.$router.push({
        path: 'interface'
      });
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
