<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <slot name="opener" />
        <v-btn color="red lighten-2" dark v-on="on">
          Click Me
        </v-btn>
      </template>

      <v-card>
        <slot name="content" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
