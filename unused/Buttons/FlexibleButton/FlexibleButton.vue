<template>
  <v-sheet
    :color="outlined ? 'transparent' : color"
    class="position--relative text-transform--initial user-select--none overflow--hidden"
    :class="[
      outlined ? 'outlined' : '',
      small ? 'px-10 py-4' : 'pa-10',
      medium ? 'px-10 py-7' : 'pa-10',
      nopadding ? 'nopadding' : '',
      noclick ? '' : 'cursor--pointer'
    ]"
    @click="changeRoute"
  >
    <slot />
    <div v-if="newTag" class="new-tag">NEW</div>
  </v-sheet>
</template>

<script>
export default {
  props: {
    to: { default: () => {}, type: Object },
    small: { default: false, type: Boolean },
    medium: { default: false, type: Boolean },
    outlined: { default: false, type: Boolean },
    color: { default: 'white', type: String },
    nopadding: { default: false, type: Boolean },
    noclick: { default: false, type: Boolean },
    newTag: { default: false, type: Boolean }
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
.v-sheet {
  border-radius: 10px;
}
.mew6-component--flexible-button .outlined {
  border-left-color: white !important;
  border-right-color: white !important;
  border-top-color: white !important;
  border-bottom-color: white !important;
  border: 1px solid white;
}
.nopadding {
  padding: 0 !important;
}
.new-tag {
  position: absolute;
  right: -30px;
  top: -15px;
  background-color: red;
  color: white;
  font-size: 10px;
  padding: 20px 25px 0 25px;
  font-weight: 600;
  transform: rotate(45deg);
}
.outlined {
  border: 1px solid white !important;
}
</style>
