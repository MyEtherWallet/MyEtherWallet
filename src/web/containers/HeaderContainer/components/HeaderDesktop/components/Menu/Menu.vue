<template>
  <div class="full-width menu-container d-flex align-center">
    <router-link
      class="white--text text-decoration--none"
      :to="{ name: 'HowItWorks', params: {} }"
    >
      How it works
    </router-link>
    <mew-menu text-color="white--text" :list-obj="mewMenuCompany" />
    <mew-menu text-color="white--text" :list-obj="mewMenuTools" />
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data: () => ({
    menuResetKey: 1,
    mewMenuCompany: {
      name: 'Company',
      items: [
        {
          title: 'About us'
        },
        {
          title: 'Team'
        },
        {
          title: 'Support'
        },
        {
          title: 'Blog'
        }
      ]
    },
    mewMenuTools: {
      name: 'Tools',
      items: [
        {
          title: 'Watch only address'
        },
        {
          title: 'Send offline helper'
        },
        {
          title: 'Verify message'
        },
        {
          title: 'Convert units'
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
