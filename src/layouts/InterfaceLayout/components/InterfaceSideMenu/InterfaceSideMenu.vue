<template>
  <div class="transactions-side-menu">
    <div class="side-menu-header">
      <img src="~@/assets/images/logo.png" />
      <div @click="toggleSideMenu"><i class="fa fa-lg fa-times"></i></div>
    </div>
    <div class="side-menu">
      <ul>
        <li v-for="(tab, idx) in tabData" :key="tab.name + idx">
          <div
            :class="[
              isTabActive(tab.routes) ? 'active' : '',
              disableTab(tab.name) ? 'disable' : '',
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
              :class="isTabActive(child.routes) ? 'active' : ''"
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
import mapGetters from 'vuex';
const env = NODE_ENV;
export default {
  data() {
    return {
      env: env,
      tabData: tabsConfig.tab
    };
  },
  computed: {
    ...mapGetters({
      online: 'online',
      network: 'network'
    })
  },
  methods: {
    disableTab(tabName) {
      if (!this.online) {
        if (tabName === 'message') {
          return false;
        }
      } else {
        if (this.env === 'production') {
          if (tabName === 'message' || tabName === 'swap') {
            return false;
          }
        }

        if (this.env === 'production') return false;
      }
      return true;
    },
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
        this.$router.push({ path: tab.children[0].routes[0] });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
