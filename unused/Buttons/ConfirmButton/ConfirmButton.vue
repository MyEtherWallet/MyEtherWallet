<template>
  <div :class="center ? 'd-flex justify-center' : ''" class="my-6">
    <v-checkbox v-model="checkbox" hide-details class="my-0 py-0">
      <template v-slot:label v-slot:activator="{ on }">
        <div>
          <slot @click.stop v-on="on" />
        </div>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ConfirmButton',
  props: { center: { default: false, type: Boolean } },
  data() {
    return {
      checkbox: false
    };
  }
};
</script>

<style lang="scss" scoped></style>
