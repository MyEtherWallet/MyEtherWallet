<template>
  <div class="mew-component--app-mewtopia-block">
    <!-- Desktop -->
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div
          v-lazy:background-image="backgroundImg"
          class="border-radius--10px card-content d-flex align-center justify-space-between"
        >
          <div>
            <h1 class="white--text">{{ $t('home.mewtopia-block.title') }}</h1>
            <p class="white--text mt-3">
              {{ $t('home.mewtopia-block.text') }}
            </p>
          </div>
          <mew-button
            btn-link="https://www.mewtopia.com/"
            :has-full-width="false"
            :title="$t('home.mewtopia-block.button-text')"
            btn-style="outline"
            color-theme="white"
            btn-size="xlarge"
            @click.native="trackMewtopia"
          />
        </div>
      </v-container>
    </div>

    <!--Mobile -->
    <div class="mobile-content d-block d-lg-none">
      <div v-lazy:background-image="backgroundImg" class="card-content">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-8">
            <h1 class="white--text pb-2">
              {{ $t('home.mewtopia-block.mobile.title-one') }}
            </h1>
            <h1 class="white--text">
              {{ $t('home.mewtopia-block.mobile.title-two') }}
            </h1>
            <p class="white--text mt-3">
              {{ $t('home.mewtopia-block.text') }}
            </p>
          </div>
          <mew-button
            btn-link="https://www.mewtopia.com/"
            :has-full-width="false"
            :title="$t('home.mewtopia-block.button-text')"
            btn-style="outline"
            color-theme="white"
            btn-size="xlarge"
            @click.native="trackMewtopia"
          />
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
export default {
  name: 'AppMewtopiaBlock',
  mixins: [handlerAnalytics],
  data() {
    return {
      backgroundImg: require('@/assets/images/backgrounds/bg-light.jpg')
    };
  },
  methods: {
    trackMewtopia() {
      this.trackLandingPageAmplitude('MewTopia');
    }
  }
};
</script>

<style lang="scss" scoped>
.desktop-content {
  .card-content {
    padding: 80px 90px;
    background-position: 0px 0px;
    background-size: 100%;
  }
}

.mobile-content {
  .card-content {
    padding: 56px 20px;
    background-position: center right -30px;
    background-size: cover;
  }
}
</style>
