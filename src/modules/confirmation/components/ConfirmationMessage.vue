<template>
  <div style="width: 100%">
    <v-row dense no-gutters class="mb-2">
      <v-col cols="12" align-self="center">
        <v-textarea
          ref="signatureContent"
          outlined
          label="Signature"
          :value="msg"
          full-width
          readonly
          auto-grow
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-center my-8">
      <mew-button btn-size="xlarge" title="Copy" @click.native="copy" />
    </div>
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
    return {};
  }
};
</script>

<style lang="scss">
.v-application .warning {
  border-radius: 10px;
}
</style>
