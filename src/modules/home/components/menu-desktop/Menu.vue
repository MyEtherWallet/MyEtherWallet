<template>
  <div class="d-flex align-center">
    <router-link
      class="white--text text-decoration--none"
      :to="{ name: 'HowItWorks' }"
    >
      How it works
    </router-link>

    <div class="mx-8" />
    <site-menu />
    <div class="mx-8" />
    <a
      href="https://ccswap.myetherwallet.com/#/"
      target="_blank"
      class="white--text text-decoration--none"
    >
      Buy ETH
    </a>
  </div>
</template>

<script>
import siteMenu from './SiteMenu';
export default {
  name: 'DesktopMenu',
  components: { siteMenu },
  data: () => ({
    menuResetKey: 1
  }),
  methods: {}
};
</script>
