<template>
  <v-sheet color="yellow lighten-5" class="py-7 px-11 border-radius--10px">
    <div class="d-flex align-center mb-1">
      <mew6-icon-warning class="mr-2" />
      <div class="text-uppercase font-weight-bold subtitle-1">
        Caution
      </div>
    </div>
    <div class="pl-8">
      <span>DO NOT</span> take a screenshot or share this phrase with anyone.
      This phrase acts as the <span>PRIVATE KEY</span> to access your wallet.
      <a href="/">Learn more</a>
    </div>
  </v-sheet>
</template>

<script>
export default {
  data: () => ({})
};
</script>

<style lang="scss" scoped>
span {
  color: red;
  font-weight: 500;
}
</style>
