<template>
  <div class="modal-container">
    <b-modal ref="registerdomain" hide-footer centered class="bootstrap-modal padding-25-25" title="Register Domain">
      <div class="domain-block">
        <p class="domain-name">
          bestkat1988.eth
        </p>
        <p class="domaini-name-availability">
          Cheers! This Domain is available.
        </p>
      </div>

      <ul class="input-container">
        <li>
          <div class="input-title">
            <p>Actual Bid Amount</p>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <div class="form_text mew-custom-form__text">
            <input type="text" name="">
            <span>.eth</span>
          </div>
        </li>

        <li>
          <div class="input-title">
            <p>Bid Mask</p>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <div class="form_text mew-custom-form__text">
            <input type="text" name="">
          </div>
        </li>

        <li>
          <div class="input-title">
            <p>Secret Phrase</p>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <div class="form_text mew-custom-form__text">
            <input type="text" name="">
          </div>
        </li>
      </ul>

      <div class="button-container">
        <div class="large-round-button-green-border ">Cancel</div>
        <div class="large-round-button-green-filled">Buy it</div>
      </div>

    </b-modal>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: [],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "RegisterDomainModal.scss";
</style>
