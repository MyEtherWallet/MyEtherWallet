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
// import tabsConfig from './InterfaceSideMenu.config';
export default {
  data() {
    return {
      tabData: [
        {
          name: 'send-transaction',
          routes: [
            '/interface/send-transaction',
            '/interface',
            '/interface/send-offline',
            '/interface/send-offline/generate-info',
            '/interface/send-offline/generate-tx',
            '/interface/send-offline/send-tx'
          ],
          icons: {
            active: require('@/assets/images/sidemenu/send-active.svg'),
            inactive: require('@/assets/images/sidemenu/send.svg')
          },
          titleKey: 'interface.txSideMenuTitle',
          children: [
            {
              name: 'send-transaction',
              routes: ['/interface/send-transaction', '/interface'],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.sendTx'
            },
            {
              name: 'send-offline',
              routes: [
                '/interface/send-offline',
                '/interface/send-offline/generate-info',
                '/interface/send-offline/generate-tx',
                '/interface/send-offline/send-tx'
              ],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.offline'
            }
          ]
        },
        {
          name: 'swap',
          routes: ['/interface/swap'],
          icons: {
            active: require('@/assets/images/sidemenu/swap-active.svg'),
            inactive: require('@/assets/images/sidemenu/swap.svg')
          },
          titleKey: 'common.swap',
          children: []
        },
        {
          name: 'dapps',
          routes: [
            '/interface/dapps',
            '/interface/dapps/register-domain',
            '/interface/dapps/register-domain/bid',
            '/interface/dapps/register-domain/reveal',
            '/interface/dapps/register-domain/owned',
            '/interface/dapps/register-domain/forbidden',
            '/interface/dapps/register-domain/auction',
            '/interface/dapps/register-domain/confirm',
            '/interface/dapps/domain-sale'
          ],
          icons: {
            active: require('@/assets/images/sidemenu/dapps-active.svg'),
            inactive: require('@/assets/images/sidemenu/dapps.svg')
          },
          titleKey: 'common.dapps',
          children: []
        },
        {
          name: 'contracts',
          routes: [
            '/interface/interact-with-contract',
            '/interface/deploy-contract'
          ],
          icons: {
            active: require('@/assets/images/sidemenu/contract-active.svg'),
            inactive: require('@/assets/images/sidemenu/contract.svg')
          },
          titleKey: 'interface.txSideMenuContract',
          children: [
            {
              name: 'interact-with-contract',
              routes: ['/interface/interact-with-contract'],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.interactWcontract'
            },
            {
              name: 'deploy-contract',
              routes: ['/interface/deploy-contract'],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.depContract'
            }
          ]
        },
        {
          name: 'messages',
          routes: ['/interface/sign-message', '/interface/verify-message'],
          icons: {
            active: require('@/assets/images/sidemenu/message-active.svg'),
            inactive: require('@/assets/images/sidemenu/message.svg')
          },
          titleKey: 'interface.txSideMenuMessage',
          children: [
            {
              name: 'sign-message',
              routes: ['/interface/sign-message'],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.signMessage'
            },
            {
              name: 'verify-message',
              routes: ['/interface/verify-message'],
              icons: {
                active: '',
                inactive: ''
              },
              titleKey: 'common.verifyMessage'
            }
          ]
        }
      ]
    };
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
        this.$router.push({ path: tab.children[0].routes[0] });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
