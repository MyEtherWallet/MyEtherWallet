<template>
  <div class="mew6-component--icon-secure position--relative">
    <v-icon color="emerald" class="icon-shield">mdi-shield</v-icon>
    <v-icon color="white" class="icon-check">mdi-check-bold</v-icon>
  </div>
</template>

<script>
export default {
  props: {}
};
</script>

<style lang="scss" scoped>
.icon-shield {
  font-size: 20px;
}
.icon-check {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 11px;
}
</style>
