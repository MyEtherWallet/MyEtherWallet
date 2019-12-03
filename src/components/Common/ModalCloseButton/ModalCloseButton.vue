<template>
  <div class="width--initial">
    <v-btn v-if="size == 'normal'" icon class="position--relative">
      <div class="line1" :class="color" />
      <div class="line2" :class="color" />
    </v-btn>

    <v-btn
      v-if="size == 'large'"
      icon
      class="position--relative"
      width="50px"
      height="50px"
    >
      <div class="line1 large-button" :class="color" />
      <div class="line2 large-button" :class="color" />
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    color: { default: '', type: String },
    size: { default: 'normal', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.line1,
.line2 {
  position: absolute;
  width: 25px;
  left: 0px;
  right: 0px;
  top: 0px;
  margin: 0 auto;
  border-bottom: 1px solid $dark-sacramento;
}

.line1 {
  transform: rotate(45deg);
}

.line2 {
  transform: rotate(-45deg);
}

.white {
  border-bottom: 1px solid white;
}

.large-button {
  width: 35px;
}
</style>
