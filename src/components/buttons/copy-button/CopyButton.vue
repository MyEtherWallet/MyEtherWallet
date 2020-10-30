<template>
  <div class="mew-component--copy-btn">
    <mew-toast
      ref="toast"
      text="Copied"
      toast-type="success"
      :duration="1000"
    />
    <div class="copy-icon d-flex justify-center" @click="onBtnClick()">
      <img
        :class="white ? 'white-icon' : ''"
        src="@/assets/images/icons/icon-copy.svg"
        alt="Copy"
      />
    </div>
    <input ref="textToCopy" class="text-input" type="text" :value="text" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      default: '',
      type: String
    },
    white: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    onBtnClick() {
      /* Select the text field */
      this.$refs.textToCopy.select();
      /*For mobile devices*/
      this.$refs.textToCopy.setSelectionRange(0, 99999);

      /* Copy the text inside the text field */
      document.execCommand('copy');

      this.$refs.toast.showToast();
    }
  }
};
</script>

<style lang="scss" scoped>
.text-input {
  position: fixed;
  left: -1000px;
  top: -1000px;
}
.copy-icon {
  user-select: none;
  padding: 2px;
  cursor: pointer;
  img {
    height: 15px;
    width: 15px;

    &.white-icon {
      filter: invert(1);
    }
  }
}
</style>
