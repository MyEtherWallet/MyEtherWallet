<template>
  <v-container>
    <v-sheet
      class="border-radius--10px card-content d-flex align-center justify-space-between"
    >
      <div>
        <h2 class="white--text">Newbie in crypto?</h2>
        <h2 class="white--text">Join our journey to MEW.</h2>
      </div>
      <mew-button
        btn-link="https://www.mewtopia.com/"
        :has-full-width="false"
        title="Get Started"
        btn-style="outline"
        color-theme="white"
        button-size="xlarge"
      />
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'Join',
  components: {}
};
</script>

<style lang="scss" scoped>
.card-content {
  padding: 80px 90px;
  background-image: url('~@/assets/images/backgrounds/bg-light.png');
  background-position: 0px 0px;
  background-size: 100%;
}
</style>
