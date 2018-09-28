<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li
          v-for="(tab, idx) in tabData"
          :key="tab.name + idx">
          <div
            :class="[isTabActive(tab.routes) ? 'active' : '', 'menu-group-title']"
            @click.prevent="tabAction(tab)">
            <img :src="isTabActive(tab.routes) ? tab.icons.active : tab.icons.inactive">
            <p>{{ $t(tab.titleKey) }}</p>
            <i
              v-show="tab.children.length"
              :class="['fa', isTabActive(tab.routes) ? 'fa-angle-up':'fa-angle-down']"
              aria-hidden="true"/>
          </div>
          <ul
            v-show="isTabActive(tab.routes)"
            v-if="tab.children.length">
            <li
              v-for="(child, cidx) in tab.children"
              :key="child.name + cidx"
              :class="isTabActive(child.routes)? 'active': ''"
              @click.prevent="tabAction(child)">
              {{ $t(child.titleKey) }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import tabsConfig from './InterfaceSideMenu.config';
export default {
  data() {
    return {
      tabData: tabsConfig.tabs
    };
  },
  methods: {
    isTabActive(routes) {
      return routes.includes(this.$route.path);
    },
    tabAction(tab) {
      this.$router.push({ path: tab.routes[0] });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
