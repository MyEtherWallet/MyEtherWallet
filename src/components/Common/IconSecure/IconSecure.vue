<template>
  <div class="mew6-component--icon-secure position--relative">
    <v-icon :color="color ? color : 'emerald'" class="icon-outer">
      mdi-shield-check
    </v-icon>
  </div>
</template>

<script>
export default {
  props: {
    color: { default: '', type: String }
  }
};
</script>

<style lang="scss" scoped>
.icon-outer {
  font-size: 20px;
}
</style>
