<template>
  <div :class="center ? 'd-flex justify-center' : ''">
    <v-sheet color="transparent">
      <v-checkbox v-model="checkbox" hide-details class="my-6">
        <template v-slot:label>
          <div>
            <slot />
          </div>
        </template>
      </v-checkbox>
    </v-sheet>
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
