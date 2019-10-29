<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <v-img src="@/assets/images/common/logo-light.png" max-width="130" />
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
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
