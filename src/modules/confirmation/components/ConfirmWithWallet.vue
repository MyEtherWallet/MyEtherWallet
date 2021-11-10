<template>
  <div class="mt-10">
    <div class="text-center">
      <div>
        <mew-icon
          v-if="instance.meta.img.type === 'mew-icon'"
          class="border-radius--5px custom-icon-style"
          :icon-name="instance.meta.img.value"
          :img-height="100"
        />
        <img v-else :src="instance.meta.img.value" height="50px" />
      </div>
    </div>
    <div :class="[error !== '' ? 'redPrimary--text' : '', 'text-center mb-5']">
      <p>{{ bodyText }}</p>
    </div>
    <v-progress-linear
      v-if="error === '' && !signed"
      indeterminate
      color="greenPrimary"
      class="mb-3"
    ></v-progress-linear>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    txLength: {
      type: Number,
      default: 1
    },
    signed: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('wallet', ['instance']),
    bodyText() {
      if (this.error !== '') return this.error;
      return `Approve ${this.txLength} ${
        this.txLength > 1 ? 'transactions' : 'transaction'
      } on ${this.instance.meta.name}.`;
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-icon-style {
  border: 1px solid var(--v-basicOutlineActive-base);
}
</style>
