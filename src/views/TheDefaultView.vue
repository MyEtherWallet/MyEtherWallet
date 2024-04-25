<template>
  <div>
    <TheDefaultHeader @openMobileMenu="handleOpen" />
    <v-main class="js-body">
      <router-view />
    </v-main>
    <TheDefaultFooter />
    <TheMobileMenu :is-open="mobileOpen" @closeMobileMenu="handleClose" />
    <GDPRBanner />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';

const TheDefaultHeader = defineAsyncComponent(() =>
  import('./components-default/TheDefaultHeader')
);
const TheMobileMenu = defineAsyncComponent(() =>
  import('./components-default/TheMobileMenu')
);
const TheDefaultFooter = defineAsyncComponent(() =>
  import('./components-default/TheDefaultFooter')
);
// const NewLookBanner = defineAsyncComponent(()=> import('./components-default/NewLookBanner'),)
// const TheEnkryptPopup = defineAsyncComponent(()=> import('./components-default/TheEnkryptPopup'),)
const GDPRBanner = defineAsyncComponent(() =>
  import('./components-default/GDPRBanner')
);

// data
const mobileOpen = ref(false);

// methods
const handleOpen = () => {
  mobileOpen.value = true;
};

const handleClose = () => {
  mobileOpen.value = false;
};
</script>
