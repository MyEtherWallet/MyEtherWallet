<template>
  <div class="user-input">
    <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors" v-bind:value="value" v-on:input="updateValue($event.target.value)">
    <div class="next-button large-round-button-green-filled" @click="switcher(param)">
      {{ $t("reused.next") }}<img src="~@/assets/images/icons/right-arrow.png">
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'switcher', 'param'],
  data () {
    return {
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletInput.scss";
</style>
