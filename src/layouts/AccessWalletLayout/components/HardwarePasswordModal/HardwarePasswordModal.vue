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
            autocomplete="off">
          <img
            v-if="show"
            src="@/assets/images/icons/show-password.svg"
            @click.prevent="switchViewPassword">
          <img
            v-if="!show"
            src="@/assets/images/icons/hide-password.svg"
            @click.prevent="switchViewPassword">
        </div>
        <p
          v-show="error !== ''"
          class="error"> {{ error }} </p>
        

        <div class="terms-container">
          <accept-terms-checker/>
        </div>


        <div class="the-button-container">
          <standard-button 
            :options="buttonUnlock"
          />
          <standard-button 
            :options="buttonDisabled"
          />
        </div>
        <!--
        <button
          class="submit-button large-round-button-green-filled"
          type="submit"
          @click.prevent="unlockWallet">
          {{ $t("accessWallet.unlock") }} {{ hardwareBrand }}
        </button>
      -->
      </form>
      <customer-support/>
    </div>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import AcceptTermsChecker from '@/components/AcceptTermsChecker';

export default {
  components: {
    'accept-terms-checker': AcceptTermsChecker,
    'customer-support': CustomerSupport
  },
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
      buttonUnlock: {
        title: 'Unlock',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      buttonDisabled: {
        title: 'Unlock',
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
      this.walletConstructor
        .unlock({ password: this.password })
        .then(wallet => {
          this.$emit('hardwareWalletOpen', wallet);
        })
        .catch(_error => {
          // eslint-disable-next-line
          console.error(_error); // todo replace with proper error
        });
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
