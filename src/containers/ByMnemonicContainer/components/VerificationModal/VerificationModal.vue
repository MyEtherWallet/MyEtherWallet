<template>
  <b-modal ref="verification" hide-footer centered class="bootstrap-modal-wide verification nopadding" title="Verification">
    <div class="content-block">
      <p class="block-title">Please enter and fill out the empty boxes below to verify your mnemonic phrase key.</p>
      <div class="phrases">
        <ul>
          <li class="word" v-for="(value, index) in mnemonicValues" v-bind:key="index" v-bind:data-index="index + 1">
            {{index + 1}}.<span>{{value}}</span>
            <input class="hidden" type="text" name="" autocomplete="off" />
          </li>
        </ul>
      </div>
      <div class="button-container">
        <div v-on:click="mnemonicDoneModalOpen" class="verify-button large-round-button-green-filled">
          Verify
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['mnemonicValues', 'mnemonicDoneModalOpen'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  @import "VerificationModal.scss";
</style>
