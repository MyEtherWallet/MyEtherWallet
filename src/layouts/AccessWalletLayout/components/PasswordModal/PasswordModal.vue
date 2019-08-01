<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software nopadding"
    centered
    @shown="focusInput"
  >
    <div>
      <div class="warning">
        <warning-message />
      </div>
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
        <button
          :disabled="inputValid"
          class="submit-button large-round-button-green-filled"
          type="submit"
          @click.prevent="unlockWallet"
        >
          <span v-show="!spinner">{{ $t('common.accessWallet') }}</span>
          <i v-show="spinner" class="fa fa-spin fa-spinner fa-lg" />
        </button>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { mapState } from 'vuex';
import { Toast, Wallet } from '@/helpers';
import WarningMessage from '@/components/WarningMessage';

export default {
  components: {
    'warning-message': WarningMessage
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
      show: false,
      password: '',
      spinner: false
    };
  },
  computed: {
    ...mapState(['path', 'online']),
    inputValid() {
      return (
        this.walletRequirePass(this.file) &&
        (this.password === '' || this.password.length === 0)
      );
    }
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    walletRequirePass(ethjson) {
      if (ethjson.encseed != null) return true;
      else if (ethjson.Crypto != null || ethjson.crypto != null) return true;
      else if (ethjson.hash != null && ethjson.locked) return true;
      else if (ethjson.hash != null && !ethjson.locked) return false;
      else if (ethjson.publisher == 'MyEtherWallet' && !ethjson.encrypted)
        return false;
      return true;
    },
    unlockWallet() {
      this.spinner = true;

      if (this.online && window.Worker && window.origin !== 'null') {
        const worker = new walletWorker();
        const self = this;
        worker.postMessage({
          type: 'unlockWallet',
          data: [this.file, this.password]
        });
        worker.onmessage = function(e) {
          const obj = {
            file: this.file,
            name: e.data.filename
          };
          self.setUnlockedWallet(
            new WalletInterface(
              Buffer.from(e.data._privKey),
              false,
              keyStoreType,
              '',
              JSON.stringify(obj)
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
