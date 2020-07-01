<template>
  <div class="d-flex align-center">
    <mew-menu
      :list-obj="mewMenuCompany"
      text-color="white"
      @goToPage="goToPage"
    />
    <mew-menu
      :list-obj="mewMenuTools"
      text-color="white"
      @goToPage="goToPage"
    />

    <ul :key="menuResetKey" class="pl-0 d-flex">
      <li
        v-for="(m, key) in menus"
        :key="key"
        class="list-style-type--none ml-10 d-flex align-center"
      >
        <div v-if="!m.submenus" class="menu-block">
          <router-link
            class="pa-3 text-color--white text-decoration--none"
            :to="m.to"
          >
            {{ m.label }}
          </router-link>
        </div>
        <div v-if="m.submenus" class="menu-block">
          <div class="pa-3 text-color--white d-flex align-center">
            <div>{{ m.label }}</div>
            <v-icon class="closed title">mdi-chevron-down</v-icon>
            <v-icon class="opened title">mdi-chevron-up</v-icon>
          </div>
          <div class="sub-menu">
            <ul class="px-0 py-4">
              <li
                v-for="(sm, skey) in m.submenus"
                :key="skey"
                class="list-style-type--none"
                @click="menuResetKey++"
              >
                <router-link
                  v-if="sm.to"
                  class="text-decoration--none"
                  :to="sm.to"
                >
                  {{ sm.label }}
                </router-link>
                <a
                  v-if="sm.href"
                  class="text-decoration--none"
                  target="_blank"
                  :href="sm.href"
                >
                  {{ sm.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
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
  methods: {
    goToPage(link) {
      console.log('go to:', link);
    }
  }
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
  }
  .opened {
    display: none;
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
