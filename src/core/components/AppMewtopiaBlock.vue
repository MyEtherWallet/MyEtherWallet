<template>
  <div class="mew-component--app-mewtopia-block">
    <!-- Desktop -->
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div
          class="
            border-radius--10px
            card-content
            d-flex
            align-center
            justify-space-between
          "
        >
          <div>
            <h1 class="white--text">New to crypto? Explore MEWtopia!</h1>
            <p class="white--text mt-3">
              Learn how to get the most out of Ethereum with our free library of
              resources!
            </p>
          </div>
          <mew-button
            btn-link="https://www.mewtopia.com/"
            :has-full-width="false"
            title="Get Started"
            btn-style="outline"
            color-theme="white"
            btn-size="xlarge"
          />
        </div>
      </v-container>
    </div>

    <!--Mobile -->
    <div class="mobile-content d-block d-lg-none">
      <div class="card-content">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-8">
            <h1 class="white--text pb-2">New to crypto?</h1>
            <h1 class="white--text">Explore MEWtopia!</h1>
            <p class="white--text mt-3">
              Learn how to get the most out of Ethereum with our free library of
              resources!
            </p>
          </div>
          <mew-button
            btn-link="https://www.mewtopia.com/"
            :has-full-width="false"
            title="Get Started"
            btn-style="outline"
            color-theme="white"
            btn-size="xlarge"
          />
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMewtopiaBlock',
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
    padding: 56px 20px;
    background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
    background-position: center right -30px;
    background-size: cover;
  }
}
</style>
