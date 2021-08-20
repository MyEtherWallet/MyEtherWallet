<template>
  <div>
    <v-container class="py-15">
      <custom-color-btn
        class="ma-1"
        btn-color="primary"
        text-color=""
        hover-color="blue"
        ripple-color="red"
        x-large
      >
        <div class="pa-3">
          <div>Button Color: primary</div>
          <div>Text Color:</div>
          <div>Hover Color: blue</div>
          <div>Ripple Color: red</div>
        </div>
      </custom-color-btn>

      <custom-color-btn
        class="ma-1"
        btn-color="pink"
        text-color="black"
        hover-color="yellow"
        ripple-color="white"
        x-large
      >
        <div class="pa-3">
          <div>Button Color: pink</div>
          <div>Text Color: black</div>
          <div>Hover Color: yellow</div>
          <div>Ripple Color: white</div>
        </div>
      </custom-color-btn>

      <custom-color-btn
        class="ma-1"
        btn-color="orange"
        text-color="blue"
        hover-color="white"
        ripple-color="yellow"
        x-large
      >
        <div class="pa-3">
          <div>Button Color: orange</div>
          <div>Text Color: blue</div>
          <div>Hover Color: white</div>
          <div>Ripple Color: yellow</div>
        </div>
      </custom-color-btn>
    </v-container>

    <home-landing />
    <home-features />
    <home-socials />
    <home-why-mew />
    <app-mewtopia-block />
    <app-partners-block />
    <app-get-started />
  </div>
</template>

<script>
import CustomColorBtn from '@/components/CustomColorBtn';
import HomeLanding from '../components-default/HomeLanding';
import HomeFeatures from '../components-default/HomeFeatures';
import HomeSocials from '../components-default/HomeSocials.vue';
import HomeWhyMew from '../components-default/HomeWhyMew';
import AppMewtopiaBlock from '@/core/components/AppMewtopiaBlock';
import AppGetStarted from '@/core/components/AppGetStarted';
import AppPartnersBlock from '@/core/components/AppPartnersBlock';

export default {
  name: 'TheHomeLayout',
  components: {
    CustomColorBtn,
    HomeLanding,
    HomeFeatures,
    HomeSocials,
    HomeWhyMew,
    AppMewtopiaBlock,
    AppGetStarted,
    AppPartnersBlock
  }
};
</script>
