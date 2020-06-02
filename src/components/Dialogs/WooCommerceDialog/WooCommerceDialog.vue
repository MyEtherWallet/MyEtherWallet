<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="400px">
      <v-sheet color="gray">
        aaa
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: { default: false, type: Boolean }
  },
  data() {
    return { dialog: false };
  },
  watch: {
    show(val) {
      this.dialog = val;
    }
  }
};
</script>

<style lang="scss" scoped></style>
