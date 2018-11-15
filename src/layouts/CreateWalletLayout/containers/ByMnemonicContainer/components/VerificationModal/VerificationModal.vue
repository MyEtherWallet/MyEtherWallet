<template>
  <b-modal
    ref="verification"
    hide-footer
    centered
    class="bootstrap-modal-wide verification nopadding"
    title="Verification"
  >
    <div class="content-block">
      <p class="block-title">
        Please enter and fill out the empty boxes below to verify your mnemonic
        phrase key.
      </p>
      <div class="phrases">
        <ul>
          <li
            v-for="(value, index) in mnemonicValues"
            :key="index"
            :data-index="index + 1"
            class="word"
          >
            {{ index + 1 }}.<span>{{ value }}</span>
            <input class="hidden" type="text" name="" autocomplete="off" />
          </li>
        </ul>
      </div>
      <div class="button-container">
        <div
          class="verify-button large-round-button-green-filled"
          @click="mnemonicDoneModalOpen"
        >
          Verify
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    mnemonicValues: {
      type: Array,
      default: function() {
        return [];
      }
    },
    mnemonicDoneModalOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'VerificationModal-desktop.scss';
@import 'VerificationModal-tablet.scss';
@import 'VerificationModal-mobile.scss';
</style>
