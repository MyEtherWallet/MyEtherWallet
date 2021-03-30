<template lang="html">
  <div>
    <b-modal
      ref="modal"
      hide-header
      class="bootstrap-modal nopadding"
      :dialog-class="dialogClass"
      hide-footer
    >
      <div class="text-center text-container">
        {{ details.desc }}
      </div>
      <div class="d-flex align-items-center btn-container">
        <button class="mid-round-button-green-border" @click="onLeftClick">
          {{ details.rightBtn }}
        </button>
        <button
          class="mid-round-button-green-filled ml-3"
          @click="onRightClick"
        >
          {{ details.leftBtn }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1
    };
  },
  computed: {
    details() {
      return {
        desc:
          this.step === 1
            ? this.$t('common.popup.desc1')
            : this.$t('common.popup.desc2'),
        rightBtn:
          this.step === 1
            ? this.$t('common.popup.rightBtn1')
            : this.$t('common.popup.rightBtn2'),
        leftBtn:
          this.step === 1
            ? this.$t('common.popup.leftBtn1')
            : this.$t('common.popup.leftBtn2')
      };
    },
    dialogClass() {
      const arr = ['interface-dialog'];
      switch (this.step) {
        case 2:
          arr.push('off-center-right');
          return arr;
        case 3:
          arr.push('off-center-left');
          return arr;
        default:
          break;
      }
      return arr;
    }
  },
  mounted() {
    console.error('dialog', this.dialogClass);
  },
  methods: {
    onRightClick() {
      this.step < 4 ? this.changeDisplay() : this.onLeftClick();
    },
    changeDisplay() {
      this.step += 1;
    },
    onLeftClick() {
      this.$emit('turnOff');
      this.step = 1;
      this.$refs.modal.hide();
    }
  }
};
</script>
<style lang="scss">
.interface-dialog {
  .text-container {
    padding: 20px;
    width: 100%;
  }
  .btn-container {
    padding: 20px;
  }
  &.off-center-left {
    margin-top: 150px;
    margin-left: 100px;
  }
  &.off-center-right {
    margin-top: 500px;
    margin-right: 30px;
  }
}
</style>
