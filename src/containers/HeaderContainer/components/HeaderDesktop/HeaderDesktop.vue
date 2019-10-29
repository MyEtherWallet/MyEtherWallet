<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <v-img src="@/assets/images/common/logo-light.png" max-width="130" />
        <v-spacer></v-spacer>
        <v-btn class="white--text" large depressed outlined>
          <v-img
            src="@/assets/images/common/icons/buy-eth.svg"
            class="mr-1 ml-n1"
          />
          Buy ETH
        </v-btn>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HeaderDesktop'
};
</script>

<style lang="scss" scoped></style>
