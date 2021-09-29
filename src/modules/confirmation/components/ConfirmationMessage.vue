<template>
  <div>
    <div class="d-flex justify-space-between mb-2">
      <v-textarea
        ref="signatureContent"
        outlined
        label="Signature"
        :value="msg"
        :auto-grow="true"
        :readonly="true"
      ></v-textarea>
    </div>
    <div class="d-flex justify-center my-8">
      <mew-button btn-size="xlarge" title="Copy" @click.native="copy" />
    </div>
    <mew-warning-sheet :description="warningDescription" />
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    copy: {
      type: Function,
      default: () => {}
    }
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…'
    };
  }
};
</script>

<style lang="scss">
.v-application .warning {
  border-radius: 10px;
}
</style>
