<template>
  <div class="interface-mobile-menu">
    <div class="mobile-menu-container">
      <div
        v-for="(tab, idx) in tabData"
        :key="tab.name + idx"
        :class="tab.onlineOnly && !online ? 'disabled-item' : ''"
      >
        <div
          :class="isTabActive(tab.routes) ? 'active' : ''"
          @click.prevent="tabAction(tab)"
        >
          <p>{{ $t(tab.titleKey) }}</p>
        </div>
        <div v-if="tab.children.length" class="sub-menu">
          <div
            v-for="(child, cidx) in tab.children"
            :key="child.name + cidx"
            :class="isTabActive(child.routes) ? 'active' : ''"
            @click.prevent="tabAction(child)"
          >
            {{ $t(child.titleKey) }}
          </div>
        </div>
      </div>
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

<style lang="scss" scoped>
@import 'InterfaceMobileMenuComponent.scss';
</style>
