<template>
  <div class="text-center">
    <v-dialog v-model="dialog" :width="width">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <slot name="opener" />
        </div>
      </template>

      <v-card>
        <slot name="content" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    width: { default: '500px', type: String },
    show: { default: true, type: Boolean }
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

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
