<template>
  <form class="user-input">

    <!--=== MEW custom form ========================================-->
    <div class="mew-custom-form mew-custom-form__password">
      <div class="user-input-field">
        <input
          :class="strengthClass"
          :type="password.showPassword ? 'text' : 'password'"
          name="password"
          placeholder="Please Enter At Least 9 Characters"
          v-bind:value="value"
          v-on:input="updateValue($event.target.value)"
          autocomplete="off"
        />
      </div>
      <div v-on:click="password.showPassword = !password.showPassword" class="password-icons">
        <img v-if="!password.showPassword" class="hide-password" src="~@/assets/images/icons/hide-password.svg" />
        <img v-if="password.showPassword" class="show-password" src="~@/assets/images/icons/show-password.svg" />
      </div>

      <p class="passwd-strength" v-show="value.length > 0">
        Password strength:<span :class="strengthClass">{{ strength }}</span>
      </p>
    </div>
    <!--=== MEW custom form ========================================-->

    <button class="next-button large-round-button-green-filled" type="submit" @click.prevent="switcher(param)" :disabled="value.length === 0 && value.length < 9 && strength === ''">
      {{ $t("common.next") }}<img src="~@/assets/images/icons/right-arrow.png">
    </button>
  </form>
</template>

<script>
import zxcvbn from 'zxcvbn'
export default {
  props: ['value', 'switcher', 'param'],
  data () {
    return {
      strength: '',
      strengthClass: '',
      password: {
        showPassword: false
      }
    }
  },
  methods: {
    async updateValue (value) {
      let score = await zxcvbn(value).score

      this.$emit('input', value)
      switch (score) {
        case 1:
          this.strength = 'Very Weak'
          this.strengthClass = 'very-weak'
          break
        case 2:
          this.strength = 'Weak'
          this.strengthClass = 'weak'
          break
        case 3:
          this.strength = 'Weak'
          this.strengthClass = 'weak'
          break
        case 4:
          this.strength = 'Strong'
          this.strengthClass = 'strong'
          break
        default:
          this.strength = 'Very Weak'
          this.strengthClass = 'very-weak'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "CreateWalletInput.scss";
</style>
