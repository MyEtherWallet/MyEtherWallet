<template>
  <v-sheet class="position--relative" width="24px">
    <div class="line1" />
    <div class="line2" />
  </v-sheet>
</template>

<script>
export default {
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.line1,
.line2 {
  position: absolute;
  width: 25px;
  border-bottom: 1px solid $dark-sacramento;
}

.line1 {
  transform: rotate(45deg);
}

.line2 {
  transform: rotate(-45deg);
}
</style>
