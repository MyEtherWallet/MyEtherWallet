<template>
  <div class="interface-mobile-menu">
    <div class="mobile-menu-container">
      <b-dropdown :text="title">
        <div
          v-for="(tab, idx) in tabData"
          :class="tab.onlineOnly && !online ? 'disabled-item' : ''"
          :key="tab.name + idx"
          class="dropdown-menu-item"
        >
          <div
            :class="isTabActive(tab.routes) ? 'active' : ''"
            class="cat-title"
            @click.prevent="tabAction(tab)"
          >
            <p>{{ $t(tab.titleKey) }}</p>
            <i
              v-if="tab.children.length"
              class="fa fa-angle-down"
              aria-hidden="true"
            ></i>
          </div>
          <div v-if="tab.children.length" class="sub-menu">
            <b-dropdown-item
              v-for="(child, cidx) in tab.children"
              :key="child.name + cidx"
              :class="isTabActive(child.routes) ? 'active' : ''"
              @click.prevent="tabAction(child)"
            >
              {{ $t(child.titleKey) }}
            </b-dropdown-item>
          </div>
        </div>
      </b-dropdown>
      <p class="menu-small-title">
        MENU <i class="fa fa-angle-down" aria-hidden="true"></i>
      </p>
    </div>
  </div>
</template>

<script>
import tabsConfig from '../InterfaceSideMenu/InterfaceSideMenu.config.js';
import { mapState } from 'vuex';
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabData: tabsConfig.tabs
    };
  },
  computed: {
    ...mapState(['online'])
  },
  methods: {
    isTabActive(routes) {
      return routes.includes(this.$route.path);
    },
    tabAction(tab) {
      if (!tab.hasOwnProperty('children') || tab.children.length === 0) {
        this.$router.push({ path: tab.routes[0] });
      }
    }
  }
};
</script>

<style lang="scss">
// Do not use "scope" tag for this bootstrap element.
@import 'InterfaceMobileMenu.scss';
</style>
