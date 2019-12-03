<template>
  <div>
    <v-dialog v-model="dialog" width="400px">
      <div>
        <v-btn icon @click="dialog = false">
          <ModalCloseButton />
        </v-btn>
      </div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/p2q6qrcKtj8"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </v-dialog>
  </div>
</template>

<script>
import ModalCloseButton from '@/components/Common/ModalCloseButton';

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

<style lang="scss" scoped></style>
