<template>
  <b-modal
    ref="password"
    :title="$t('common.password.string')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    static
    lazy
    @shown="focusInput"
  >
    <form class="password-form">
      <div class="input-container">
        <input
          ref="passwordInput"
          v-model="password"
          :placeholder="$t('common.password.enter')"
          name="Password"
          autocomplete="off"
        />
        <img
          v-if="show"
          alt
          src="@/assets/images/icons/show-password.svg"
          @click.prevent="switchViewPassword"
        />
        <img
          v-if="!show"
          alt
          src="@/assets/images/icons/hide-password.svg"
          @click.prevent="switchViewPassword"
        />
      </div>
      <p v-show="error !== ''" class="error">{{ error }}</p>
      <p v-show="errors.has('password')" class="error">
        {{ errors.first('password') }}
      </p>
      <button
        :class="[
          errors.has('password') || password.length === 0 ? 'disabled' : '',
          'submit-button large-round-button-green-filled'
        ]"
        type="submit"
        @click.prevent="unlockWallet"
      >
        {{ $t('common.wallet.unlock') }} {{ hardwareBrand }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import cwsTransportLib from '@coolwallets/transport-web-ble';

export default {
  props: {
    walletConstructor: {
      type: Function,
      default: function() {}
    },
    hardwareBrand: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      password: '',
      error: ''
    };
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    focusInput() {
      this.password == '';
      this.$refs.passwordInput.focus();
    },
    async unlockWallet() {
      if (this.hardwareBrand === 'CoolWallet') {
        await cwsTransportLib.listen(async (error, device) => {
          if (device) {
            const transport = await cwsTransportLib.connect(device);
            store.set('cwPass', this.password.toString());
            this.walletConstructor(transport, this.password.toString())
              .then(_newWallet => {
                if (_newWallet) {
                  this.$emit('hardwareWalletOpen', _newWallet);
                } else {
                  this.walletConstructor.errorHandler({
                    name: 'NoWalletInstance'
                  });
                }
              })
              .catch(this.walletConstructor.errorHandler);
          }
        });
      } else {
        this.walletConstructor('', this.password)
          .then(_newWallet => {
            this.$emit('hardwareWalletOpen', _newWallet);
          })
          .catch(this.walletConstructor.errorHandler);
      }
    },
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'HardwarePasswordModal.scss';
</style>
