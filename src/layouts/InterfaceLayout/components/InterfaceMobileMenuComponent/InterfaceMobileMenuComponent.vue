<template>
  <div class="interface-mobile-menu">
    <div class="mobile-menu-container">
      <div
        v-for="(tab, idx) in tabData"
        :key="tab.name + idx"
        :class="tab.onlineOnly && !online ? 'disabled-item' : ''"
        class="menu-group"
      >
        <div
          :class="isTabActive(tab.routes) ? 'active' : ''"
          class="top-menu"
          @click.prevent="tabAction(tab)"
        >
          <p>
            <img
              v-if="isTabActive(tab.routes)"
              :src="tab.icons.active"
              width="40"
              height="40"
            />
            <img v-else :src="tab.icons.inactive" width="40" height="40" />

            {{ $t(tab.titleKey) }}
          </p>
        </div>
        <div v-if="tab.children.length" class="sub-menu pl-3">
          <div
            v-for="(child, cidx) in tab.children"
            :key="child.name + cidx"
            :class="isTabActive(child.routes) ? 'active' : ''"
            class="mt-3"
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
    },
    closeMenu: {
      type: Function,
      default: function() {}
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
  mounted() {
    console.log(this.tabData);
  },
  methods: {
    isTabActive(routes) {
      return routes.includes(this.$route.path);
    },
    tabAction(tab) {
      if (!tab.hasOwnProperty('children') || tab.children.length === 0) {
        this.$router.push({ path: tab.routes[0] });
        this.closeMenu();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceMobileMenuComponent.scss';
</style>
