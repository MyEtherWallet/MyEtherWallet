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
import { ref } from 'vue';

import TheDefaultHeader from './components-default/TheDefaultHeader';
import TheMobileMenu from './components-default/TheMobileMenu';
import TheDefaultFooter from './components-default/TheDefaultFooter';
// const NewLookBanner = defineAsyncComponent(()=> import('./components-default/NewLookBanner'),)
// const TheEnkryptPopup = defineAsyncComponent(()=> import('./components-default/TheEnkryptPopup'),)
import GDPRBanner from './components-default/GDPRBanner';

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
