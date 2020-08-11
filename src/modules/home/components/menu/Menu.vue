<template>
  <div class="full-width menu-container d-flex align-center">
    <router-link
      class="white--text text-decoration--none"
      :to="{ name: 'HowItWorks', params: {} }"
    >
      How it works
    </router-link>
    <mew-menu text-color="white--text" :list-obj="mewMenuCompany" />
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
export default {
  name: 'Menu',
  data: () => ({
    menuResetKey: 1,
    mewMenuCompany: {
      name: 'Wallet actions',
      items: [
        {
          title: 'Send transction',
          to: '/wallet/dashboard'
        },
        {
          title: 'Explore Dapps',
          to: '/wallet/dashboard'
        },
        {
          title: 'Swap Tokens',
          to: '/wallet/dashboard'
        },
        {
          title: 'Sign message',
          to: '/wallet/dashboard'
        },
        {
          title: 'Watch only address',
          to: '/tools'
        },
        {
          title: 'Send offline helper',
          to: '/tools'
        },
        {
          title: 'Verify message',
          to: '/tools'
        },
        {
          title: 'Convert units',
          to: '/tools'
        }
      ]
    }
  }),
  methods: {}
};
</script>

<style lang="scss" scoped>
.menu-container {
  justify-content: space-evenly;
}
</style>
