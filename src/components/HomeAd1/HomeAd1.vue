<template>
  <v-container>
    <v-card class="card-content d-flex align-center" flat>
      <div>
        <h2 class="white--text">
          Newbie in crypto?
        </h2>
        <h2 class="white--text">
          Join our journey to MEW.
        </h2>
      </div>
      <v-spacer />
      <mew-button
        btn-link="https://www.mewtopia.com/"
        :has-full-width="false"
        title="Get Started"
        btn-style="outline"
        color-theme="white"
        button-size="xlarge"
      />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'HomeAd1',
  components: {}
};
</script>

<style lang="scss" scoped>
.v-card {
  border-radius: 10px !important;
}

.card-content {
  //background: linear-gradient(130deg, #0b2840 0%, #3d9e91 80%, #00c4ff 100%);
  padding: 70px 90px;
  background-image: url('~@/assets/images/backgrounds/bg-light.png');
  background-position: 0px 0px;
  background-size: 100%;
}
</style>
