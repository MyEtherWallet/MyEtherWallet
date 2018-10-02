<template>
  <b-modal
    ref="jsonString"
    title="JSON String"
    hide-footer
    class="bootstrap-modal"
    centered>
    <form class="json-string-form">
      <div class="input-container">
        <textarea
          id=""
          name=""/>
      </div>
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        Confirm
      </button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    updateJsonString: {
      type: Function,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import 'JsonStringModal.scss';
</style>
