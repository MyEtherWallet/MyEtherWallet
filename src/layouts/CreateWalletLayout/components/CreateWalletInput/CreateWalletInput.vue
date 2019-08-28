<template>
  <ValidationProvider
    v-slot="{ errors }"
    :rules="param === 'Json' ? 'required|min:9' : ''"
    name="password"
  >
    <form class="user-input">
      <!-- === MEW custom form ======================================== -->
      <div
        :class="fullWidth ? 'full-width' : ''"
        class="mew-custom-form mew-custom-form__password "
      >
        <div class="user-input-field">
          <input
            :class="strengthClass"
            :type="password.showPassword ? 'text' : 'password'"
            :value="value"
            v-model="password"
            name="password"
            placeholder="Please Enter At Least 9 Characters"
            autocomplete="off"
            @input="updateValue($event.target.value)"
          />
        </div>
        <div
          class="password-icons"
          @click="password.showPassword = !password.showPassword"
        >
          <img
            v-if="!password.showPassword"
            class="hide-password"
            src="~@/assets/images/icons/hide-password.svg"
          />
          <img
            v-if="password.showPassword"
            class="show-password"
            src="~@/assets/images/icons/show-password.svg"
          />
        </div>

        <p v-show="value.length > 0" class="passwd-strength">
          Password strength: <span :class="strengthClass">{{ strength }}</span>
        </p>
        <p v-if="value.length > 0" class="passwd-strength">
          {{ errors[0] }}
        </p>
      </div>
      <!-- === MEW custom form ======================================== -->
      <button
        v-if="showButton"
        :class="[
          errors[0] || value.length === 0 || strengthClass !== 'strong'
            ? 'disabled'
            : '',
          'large-round-button-green-filled next-button'
        ]"
        type="submit"
        @click.prevent="switcher(param)"
      >
        {{ $t('common.next') }}
        <img src="~@/assets/images/icons/right-arrow.png" />
      </button>
    </form>
  </ValidationProvider>
</template>

<script>
import zxcvbn from 'zxcvbn';
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    switcher: {
      type: Function,
      default: function() {}
    },
    param: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: true
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      strength: '',
      strengthClass: '',
      password: {
        showPassword: false
      }
    };
  },
  methods: {
    async updateValue(value) {
      const score = await zxcvbn(value).score;

      this.$emit('input', value);
      switch (score) {
        case 1:
          this.strength = 'Very Weak';
          this.strengthClass = 'very-weak';
          break;
        case 2:
          this.strength = 'Weak';
          this.strengthClass = 'weak';
          break;
        case 3:
          this.strength = 'Good';
          this.strengthClass = 'strong';
          break;
        case 4:
          this.strength = 'Strong';
          this.strengthClass = 'strong';
          break;
        default:
          this.strength = 'Very Weak';
          this.strengthClass = 'very-weak';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInput.scss';
</style>
