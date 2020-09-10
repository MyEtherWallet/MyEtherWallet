<template>
  <div class="mew-component--landing">
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div
          class="border-radius--10px card-content d-flex align-center justify-space-between"
        >
          <div>
            <h2 class="white--text">
              Newbie in crypto?
            </h2>
            <h2 class="white--text">
              Join our journey to MEW.
            </h2>
          </div>
          <mew-button
            btn-link="https://www.mewtopia.com/"
            :has-full-width="false"
            title="Get Started"
            btn-style="outline"
            color-theme="white"
            button-size="xlarge"
          />
        </div>
      </v-container>
    </div>

    <div class="mobile-content d-block d-lg-none">
      <div class="card-content">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-10">
            <h1 class="white--text">
              Newbie in crypto?
            </h1>
            <h2 class="white--text">
              Join our journey to MEW.
            </h2>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Join',
  components: {}
};
</script>

<style lang="scss" scoped>
.desktop-content {
  .card-content {
    padding: 80px 90px;
    background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
    background-position: 0px 0px;
    background-size: 100%;
  }
}

.mobile-content {
  .card-content {
    padding: 4rem 2rem;
    background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
    background-position: center right -30px;
    background-size: cover;
  }
}
</style>
