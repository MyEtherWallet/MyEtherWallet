<template>
  <form class="user-input">
    <!-- === MEW custom form ======================================== -->
    <div
      :class="fullWidth ? 'full-width' : ''"
      class="mew-custom-form mew-custom-form__password "
    >
      <div class="user-input-field">
        <input
          v-validate="param === 'Json' ? 'required|min:9' : ''"
          :type="password.showPassword ? 'text' : 'password'"
          :value="value"
          name="password"
          autocomplete="off"
          @input="updateValue($event.target.value)"
           :placeholder="$t('common.password.enter')"
        />
      </div>
      <div
        class="password-icons"
        @click="password.showPassword = !password.showPassword"
      >
        <img
          v-if="!password.showPassword"
          alt
          class="hide-password"
          src="~@/assets/images/icons/hide-password.svg"
        />
        <img
          v-if="password.showPassword"
          alt
          class="show-password"
          src="~@/assets/images/icons/show-password.svg"
        />
      </div>
    </div>
    <!-- === MEW custom form ======================================== -->
    <button
      v-if="showButton"
      :class="[
        errors.has('password') ||
        value.length === 0 ||
        strengthClass !== 'strong'
          ? 'disabled'
          : '',
        'large-round-button-green-filled next-button'
      ]"
      type="submit"
      @click.prevent="switcher(param)"
    >
      {{ $t('common.next') }}
      <img alt src="~@/assets/images/icons/right-arrow.png" />
    </button>
  </form>
</template>

<script>
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
      this.$emit('input', value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInput.scss';
</style>
