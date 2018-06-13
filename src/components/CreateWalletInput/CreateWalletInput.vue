<template>
  <form class="user-input">
    <input type="password" name="password" placeholder="Please Enter At Least 9 Characters" v-bind:value="value" v-on:input="updateValue($event.target.value)">
    <p v-show="value.length > 0">Password strength: <span :class="strengthClass">{{ strength }}</span></p>
    <button class="next-button large-round-button-green-filled" type="submit" @click.prevent="switcher(param)" :disabled="value.length === 0 && value.length < 9 && strength === ''">
      {{ $t("reused.next") }}<img src="~@/assets/images/icons/right-arrow.png">
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
    updateValue: async function (value) {
      const self = this
      let score = await zxcvbn(value).score

      self.$emit('input', value)
      switch (score) {
        case 1:
          self.strength = 'Very Weak'
          self.strengthClass = 'very-weak'
          break
        case 2:
          self.strength = 'Weak'
          self.strengthClass = 'weak'
          break
        case 3:
          self.strength = 'Strong'
          self.strengthClass = 'strong'
          break
        case 4:
          self.strength = 'Very Strong'
          self.strengthClass = 'very-strong'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletInput.scss";
</style>
