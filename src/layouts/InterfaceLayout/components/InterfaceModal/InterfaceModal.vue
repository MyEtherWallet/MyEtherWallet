<template>
  <b-modal
    ref="interfaceBModal"
    hide-header
    class="bootstrap-modal nopadding"
    :dialog-class="dialogClass"
    hide-footer
  >
    <div class="text-center text-container">
      {{ text.desc }}
    </div>
    <div class="d-flex align-items-center btn-container">
      <button class="mid-round-button-green-border" @click="onLeftClick">
        {{ text.rightBtn }}
      </button>
      <button class="mid-round-button-green-filled ml-3" @click="onRightClick">
        {{ text.leftBtn }}
      </button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'InterfaceModal',
  props: {
    step: {
      default: 0,
      type: Number
    }
  },
  computed: {
    text() {
      return {
        desc:
          this.step === 1
            ? this.t('common.popup.desc1')
            : this.t('common.popup.desc2'),
        rightBtn:
          this.step === 1
            ? this.t('common.popup.rightBtn1')
            : this.t('common.popup.rightBtn2'),
        leftBtn:
          this.step === 1
            ? this.t('common.popup.leftBtn1')
            : this.t('common.popup.leftBtn2')
      };
    },
    dialogClass() {
      const arr = ['interface-dialog'];
      return this.step === 2
        ? arr.push('off-center-right')
        : this.step === 3
        ? arr.push('off-center=left')
        : arr;
    }
  },
  methods: {
    onRightClick() {
      this.step < 4 ? this.hideShowModal() : this.onLeftClick();
    },
    hideShowModal() {
      this.$refs.interfaceModal.hide();
      this.step += 1;
      this.$refs.interfaceModal.show();
    },
    onLeftClick() {
      this.$emit('turnOff');
      this.$refs.interfaceModal.hide();
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
  &.off-center-right {
    margin-top: 150px;
    margin-left: 40px;
  }
  &.off-center-right {
    margin-top: 50px;
    margin-right: 30px;
  }
}
</style>
