<template>
  <div class="user-input">
    <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors" v-bind:value="value" v-on:input="updateValue($event.target.value)">
    <div class="next-button large-round-button-green-filled" @click="switcher('Json')">
      {{ $t("reused.next") }}<img src="~@/assets/images/icons/right-arrow.png">
    </div>
  </div>
  <!-- <div class="footer-text">
    <p>
      <span>{{ $t("createWallet.doNotForget") }}</span>
      {{ $t("createWallet.doNotForgetDesc") }}
      <span>{{ $t("createWallet.keyPass") }}</span>
      {{ $t("createWallet.keyPassDesc") }}
    </p>
  </div> -->
</template>

<script>
export default {
  props: ['value', 'switcher'],
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
