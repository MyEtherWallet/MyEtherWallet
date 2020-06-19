<template>
  <div class="mew6-component--flexible-button">
    <v-sheet
      :color="outlined ? 'transparent' : 'white'"
      class="text-transform--initial user-select--none cursor--pointer"
      :class="[
        outlined ? 'outlined' : '',
        small ? 'px-10 py-4' : 'pa-10',
        medium ? 'px-10 py-7' : 'pa-10'
      ]"
      @click="changeRoute"
    >
      <slot />
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: {
    to: { default: () => {}, type: Object },
    small: { default: false, type: Boolean },
    medium: { default: false, type: Boolean },
    outlined: { default: false, type: Boolean }
  },
  data: () => ({}),
  methods: {
    changeRoute() {
      if (this.to) {
        this.$router.push(this.to);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mew6-component--flexible-button {
  .v-sheet {
    border-radius: 10px;
  }
}
.mew6-component--flexible-button .outlined {
  border-left-color: white !important;
  border-right-color: white !important;
  border-top-color: white !important;
  border-bottom-color: white !important;
  border: 1px solid white;
}
</style>
