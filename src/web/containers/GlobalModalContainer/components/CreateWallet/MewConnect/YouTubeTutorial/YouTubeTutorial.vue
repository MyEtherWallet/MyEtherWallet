<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="650px"
      content-class="position--relative line-height--0 overflow--initial"
    >
      <ModalCloseButton
        color="white"
        size="large"
        class="close-button"
        @click.native="dialog = false"
      />

      <iframe
        width="650"
        height="366"
        src="https://www.youtube.com/embed/p2q6qrcKtj8"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </v-dialog>
  </div>
</template>

<script>
import ModalCloseButton from '@/web/components/Common/ModalCloseButton';

export default {
  components: { ModalCloseButton },
  props: {
    active: { default: false, type: Boolean }
  },
  data: () => ({
    dialog: false
  }),
  mounted() {
    this.dialog = this.active;
  }
};
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  right: -50px;
  top: -50px;
}
</style>
