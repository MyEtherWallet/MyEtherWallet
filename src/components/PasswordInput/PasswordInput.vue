<template>
  <div class="password-input">
    
    <standard-input 
      :options="inputPassword" />
    <div class="show-password-icons">
      <img 
        v-if="!isPassword"
        class="showPassword"
        src="@/assets/images/icons/show-password.svg" 
        @click="isPassword = !isPassword">
      <img 
        v-if="isPassword"
        class="hidePassword"
        src="@/assets/images/icons/hide-password.svg" 
        @click="isPassword = !isPassword">
    </div>

  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isPassword: true,
      inputPassword: {
        title: '',
        value: '',
        type: 'password',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: this.texts,
        rightInputText: '',
        passwordStrength: '2'
      }
    };
  },
  computed: {},
  watch: {
    isPassword: function(newIsPassword) {
      this.inputPassword.type = newIsPassword ? 'password' : 'text';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PasswordInput.scss';
</style>
