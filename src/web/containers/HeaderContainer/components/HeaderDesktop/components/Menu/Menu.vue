<template>
  <div class="d-flex align-center">
    <router-link
      class="mr-5 pa-3 text-color--white text-decoration--none"
      :to="{ name: 'HowItWorks', params: {} }"
    >
      How it works
    </router-link>
    <mew-menu :list-obj="mewMenuCompany" class="mr-5" />
    <mew-menu :list-obj="mewMenuTools" />
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: { menus: { default: () => [], type: Array } },
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
.text-color--white {
  color: white;
}
.menu-block {
  position: relative;
  .closed {
    display: block;
    color: white;
  }
  .opened {
    display: none;
    color: white;
  }
  &:hover {
    .sub-menu {
      opacity: 1;
      pointer-events: all;
    }
    .closed {
      display: none;
    }
    .opened {
      display: block;
    }
  }
}
.sub-menu {
  pointer-events: none;
  transition: all 0.2s ease;
  opacity: 0;
  position: absolute;
  padding-top: 50px;
  top: 0;
  left: 0;
  ul {
    position: relative;
    background-color: white;
    border-radius: 5px;
    min-width: 170px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    &::before {
      position: absolute;
      top: -7px;
      left: 40px;
      content: '';
      width: 0px;
      height: 0px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid white;
    }
  }
  li {
    padding: 0;
    display: block;
  }
  a {
    display: block;
    color: var(--v-text_default-base);
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
}
</style>
