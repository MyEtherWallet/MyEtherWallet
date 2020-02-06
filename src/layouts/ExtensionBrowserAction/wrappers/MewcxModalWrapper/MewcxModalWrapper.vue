<template>
  <div>
    <b-modal
      ref="modalWrapper"
      hide-footer
      hide-header
      centered
      no-fade
      dialog-class="modal-wrapper-dialog"
      content-class="modal-wrapper-content"
      body-class="modal-wrapper-body"
      :modal-class="modalClassStartingPoint[direction]"
    >
      <div class="modal-contents">
        <div class="modal-top-buttons">
          <slot name="modalTopButton">
            <div></div>
          </slot>
          <slot name="modalMiddleButton">
            <div></div>
          </slot>
          <div class="modal-closer">
            <span @click="closeModal">Cancel</span>
            <img src="@/assets/images/icons/cancel.svg" @click="closeModal" />
          </div>
        </div>
        <div class="modal-content-container">
          <div class="modal-content-title">
            <h2>
              <slot name="modalContentTitle"></slot>
            </h2>
            <p>
              <slot name="modalContentSubtext"></slot>
            </p>
          </div>
          <slot></slot>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'down'
    }
  },
  data() {
    return {
      directionToClass: {
        down: 'slideInDown',
        up: 'slideInUp',
        left: 'slideInLeft'
      },
      modalClassStartingPoint: {
        down: 'modal-wrapper-up',
        up: 'modal-wrapper-down',
        left: 'modal-wrapper-left'
      }
    };
  },
  methods: {
    closeModal() {
      this.$refs.modalWrapper.hide();
    }
  }
};
</script>

<style lang="scss">
.hidden {
  display: none;
}

.modal-wrapper-dialog {
  margin: 0 !important;
  max-width: 100%;
  border-radius: 0 !important;
}
.modal-wrapper-content {
  height: 100vh;
  width: 100vw !important;
  border-radius: 0;
}
.modal-wrapper-body {
  background-color: #f2f4fa !important;
}

.modal-wrapper-down {
  top: 200vh;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 0;
}

.modal-wrapper-up {
  top: -200vh;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 0;
}

.modal-wrapper-left {
  left: -200vh;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 0;
}

.modal-wrapper-down.show {
  top: 0;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 1 !important;
}

.modal-wrapper-up.show {
  top: 0;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 1 !important;
}

.modal-wrapper-left.show {
  left: 0;
  transition: 0.1s !important;
  transition-timing-function: ease-in !important;
  opacity: 1 !important;
}
</style>
<style lang="scss" scoped>
@import 'MewcxModalWrapper.scss';
</style>
