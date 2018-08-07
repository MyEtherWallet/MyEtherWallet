<template>
  <form class="user-input">
    <input type="password" name="password" placeholder="Please Enter At Least 9 Characters" v-bind:value="value" v-on:input="updateValue($event.target.value)" autocomplete="off" />
    <p v-show="value.length > 0">Password strength: <span :class="strengthClass">{{ strength }}</span></p>
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
      strengthClass: 'weak'
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
          this.strength = 'Strong'
          this.strengthClass = 'strong'
          break
        case 4:
          this.strength = 'Very Strong'
          this.strengthClass = 'very-strong'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletInput.scss";
</style>
