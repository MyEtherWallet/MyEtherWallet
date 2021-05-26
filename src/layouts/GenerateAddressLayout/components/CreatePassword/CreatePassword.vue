<template>
  <div class="create-password-container d-flex">
    <div
      class="password-container mt-4 d-flex mew-custom-form mew-custom-form__password"
    >
      <div class="d-flex title-container">
        <span class="mr-2"
          >{{ $t('dappsStaked.generate-address.create') }}
        </span>
        <pop-over />
      </div>
      <div class="user-input-field">
        <input
          ref="password"
          v-model="pw"
          v-validate="'required|min:9'"
          name="password"
          class="mt-4"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('dappsStaked.generate-address.create-pw')"
          @input="updateValue($event.target.value)"
        />
        <div class="password-icons" @click="showPassword = !showPassword">
          <img
            v-if="!showPassword"
            alt
            class="hide-password"
            src="~@/assets/images/icons/hide-password.svg"
          />
          <img
            v-if="showPassword"
            alt
            class="show-password"
            src="~@/assets/images/icons/show-password.svg"
          />
        </div>
      </div>
      <div class="user-input-field">
        <input
          v-model="confirmedPw"
          v-validate="'required|confirmed:password'"
          name="password_confirmation"
          data-vv-as="password"
          class="mt-2"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="$t('dappsStaked.generate-address.confirm-pw')"
          min="9"
          required
        />
        <div
          class="confirm-pw-icons password-icons"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <img
            v-if="!showConfirmPassword"
            alt
            class="hide-password"
            src="~@/assets/images/icons/hide-password.svg"
          />
          <img
            v-if="showConfirmPassword"
            alt
            class="show-password"
            src="~@/assets/images/icons/show-password.svg"
          />
        </div>
      </div>
      <div v-show="pw.length > 0" class="passwd-strength ml-0">
        {{ $t('dappsStaked.generate-address.password-strength') }}:
        <span :class="[strengthClass, 'ml-1']">{{ strength }}</span>
      </div>
      <div v-show="pw.length > 0 && strengthClass !== 'strong'" class="errors">
        {{ $t('dappsStaked.generate-address.error-pw-strength') }}
      </div>
      <div v-if="errors.items.length > 0" class="errors">
        <div v-for="(error, idx) in errors.items" :key="error + idx">
          {{ error.msg }}
        </div>
      </div>
      <label class="switch mt-4 d-flex">
        <input type="checkbox" @click="agree = !agree" />
        <span class="ml-2">
          {{ $t('dappsStaked.generate-address.pw-agreement') }}
        </span>
      </label>
      <button
        :class="[
          disabled ? 'disabled' : '',
          'large-round-button-green-filled mt-5'
        ]"
        @click="onContinue"
      >
        {{ $t('common.continue') }}
        <img alt src="~@/assets/images/icons/right-arrow.png" />
      </button>
    </div>
    <div class="warning-container d-flex">
      <div><i class="fa fa-exclamation-triangle" /></div>
      <div>
        <span>{{ $t('dappsStaked.generate-address.attention') }}</span>
        <i18n
          tag="p"
          class="warning"
          path="dappsStaked.generate-address.warning"
        >
          <span slot="password-keystore">{{
            $t('dappsStaked.generate-address.password-keystore')
          }}</span>
          <span slot="no-one" class="uppercase"
            >{{ $t('dappsStaked.generate-address.no-one') }}
          </span>
        </i18n>
      </div>
    </div>
  </div>
</template>

<script>
import popOver from '@/components/PopOver';
import zxcvbn from 'zxcvbn';

export default {
  components: {
    popOver
  },
  data() {
    return {
      pw: '',
      confirmedPw: '',
      showPassword: false,
      showConfirmPassword: false,
      agree: false,
      strength: '',
      strengthClass: ''
    };
  },
  computed: {
    disabled() {
      if (
        this.pw &&
        this.confirmedPw &&
        this.errors.items.length === 0 &&
        this.agree &&
        this.strengthClass === 'strong'
      ) {
        return false;
      }
      return true;
    }
  },
  methods: {
    onContinue() {
      this.$emit('createPw', this.pw);
    },
    async updateValue(value) {
      const score = await zxcvbn(value).score;
      switch (score) {
        case 1:
          this.strength = this.$t('dappsStaked.generate-address.v-weak');
          this.strengthClass = 'very-weak';
          break;
        case 2:
          this.strength = this.$t('dappsStaked.generate-address.weak');
          this.strengthClass = 'weak';
          break;
        case 3:
          this.strength = this.$t('dappsStaked.generate-address.good');
          this.strengthClass = 'strong';
          break;
        case 4:
          this.strength = this.$t('dappsStaked.generate-address.strong');
          this.strengthClass = 'strong';
          break;
        default:
          this.strength = this.$t('dappsStaked.generate-address.v-weak');
          this.strengthClass = 'very-weak';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreatePassword.scss';
</style>
