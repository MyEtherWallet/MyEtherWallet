<template>
  <div class="transactions-side-menu">
    <div class="side-menu-header">
      <img src="~@/assets/images/logo.png" />
      <div @click="toggleSideMenu">
        <i class="fa fa-lg fa-times"></i>
      </div>
    </div>
    <div class="side-menu">
      <ul>
        <li
          v-for="(tab, idx) in tabData"
          :class="tab.onlineOnly && !online ? 'disabled-item' : ''"
          :key="tab.name + idx"
        >
          <div v-if="tab.onlineOnly && !online" class="dash" />
          <div
            :class="[
              isTabActive(tab.routes) ? 'active' : '',
              'menu-group-title'
            ]"
            @click.prevent="tabAction(tab)"
          >
            <img
              :src="
                isTabActive(tab.routes) ? tab.icons.active : tab.icons.inactive
              "
            />
            <p>{{ $t(tab.titleKey) }}</p>
            <i
              v-show="tab.children.length"
              :class="[
                'fa',
                isTabActive(tab.routes) ? 'fa-angle-up' : 'fa-angle-down'
              ]"
              aria-hidden="true"
            />
          </div>
          <ul
            v-if="tab.children.length"
            :class="[
              tab.name,
              isTabActive(tab.routes) ? 'show-child' : '',
              'child-tab'
            ]"
          >
            <li
              v-for="(child, cidx) in tab.children"
              :key="child.name + cidx"
              :class="[
                isTabActive(child.routes) ? 'active' : '',
                child.onlineOnly && !online ? 'disabled-item' : ''
              ]"
              @click.prevent="tabAction(child)"
            >
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
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tabData: tabsConfig.tabs
    };
  },
  computed: {
    ...mapState(['online'])
  },
  methods: {
    toggleSideMenu() {
      this.$store.commit('TOGGLE_SIDEMENU');
    },
    isTabActive(routes) {
      return routes.includes(this.$route.path);
    },
    tabAction(tab) {
      if (!tab.hasOwnProperty('children') || tab.children.length === 0) {
        this.toggleSideMenu();
        this.$router.push({ path: tab.routes[0] });
      } else {
        this.$router.push(
          { path: tab.children[0].routes[0] },
          () => {},
          () => {}
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
