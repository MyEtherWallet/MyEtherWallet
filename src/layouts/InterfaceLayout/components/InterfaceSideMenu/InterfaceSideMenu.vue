<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li
          v-for="(tab, idx) in tabData"
          :key="tab.title + idx + tab.caret"
          @click.prevent="tab.click">
          <div :class="[tab.isActive ? 'active' : '', 'menu-group-title']">
            <img :src="tab.iconSrc">
            <p>{{ tab.title }}</p>
            <i
              v-show="tab.hasOwnProperty('caret')"
              :class="['fa', tab.caret ? 'fa-angle-up':'fa-angle-down']"
              aria-hidden="true"/>
          </div>
          <ul
            v-show="tab.caret"
            v-if="tab.hasOwnProperty('caret')">
            <li
              v-for="(content, idx) in tab.contents"
              :key="content.itemTitle + idx"
              :class="content.itemActive? 'active': ''"
              @click.prevent="content.itemClick">
              {{ content.itemTitle }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSend: false,
      showContract: false,
      showMessage: false,
      tabData: []
    };
  },
  watch: {
    currentTab(newVal) {
      this.updateTabData();
      switch (newVal) {
        case 'send':
          this.showSend = true;
          this.showContract = false;
          break;
        case 'offline':
          this.showSend = true;
          this.showContract = false;
          break;
        case 'interactC':
          this.showSend = false;
          this.showContract = true;
          break;
        case 'deployC':
          this.showSend = false;
          this.showContract = true;
          break;
        default:
          this.showSend = false;
          this.showContract = false;
      }
    },
    showSend() {
      this.updateTabData();
    },
    showMessage() {
      this.updateTabData();
    },
    showContract() {
      this.updateTabData();
    },
    tabData: {
      handler: function(newVal) {
        this.tabData = newVal;
      },
      deep: true
    },
    $route: function() {
      this.updateTabData();
    }
  },
  mounted() {
    this.updateTabData();
  },
  methods: {
    updateTabData() {
      const self = this;
      this.tabData = [
        {
          click: function() {
            self.toggle('openSend');
          },
          isActive:
            self.$route.path === '/interface' ||
            self.$route.path === '/interface/send-offline-transaction' ||
            self.$route.path === '/interface/send-transaction',
          iconSrc:
            self.$route.path === '/interface' ||
            self.$route.path === '/interface/send-offline-transaction' ||
            self.$route.path === '/interface/send-transaction'
              ? require(`@/assets/images/sidemenu/send-active.svg`)
              : require(`@/assets/images/sidemenu/send.svg`),
          title: self.$t('interface.txSideMenuTitle'),
          caret: self.showSend,
          contents: [
            {
              itemActive: self.$route.path === '/interface/send-transaction',
              itemTitle: self.$t('common.sendTx'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({ path: '/interface/send-transaction' });
              }
            },
            {
              itemActive:
                self.$route.path === '/interface/send-offline-transaction',
              itemTitle: self.$t('common.offline'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({
                  path: '/interface/send-offline-transaction'
                });
              }
            }
          ]
        },
        {
          click: function() {
            self.$router.push({ path: '/interface/swap' });
            self.toggle();
          },
          isActive: self.$route.path === '/interface/swap',
          iconSrc:
            self.$route.path === '/interface/swap'
              ? require(`@/assets/images/sidemenu/swap-active.svg`)
              : require(`@/assets/images/sidemenu/swap.svg`),
          title: self.$t('common.swap')
        },
        {
          click: function() {
            self.$router.push({ path: '/interface/dapps' });
            self.toggle();
          },
          isActive:
            self.$route.path === '/interface/dapps' ||
            self.$route.path === '/interface/dapps/register-domain' ||
            self.$route.path === '/interface/dapps/domain-sale',
          iconSrc:
            self.$route.path === '/interface/dapps' ||
            self.$route.path === '/interface/dapps/register-domain' ||
            self.$route.path === '/interface/dapps/domain-sale'
              ? require(`@/assets/images/sidemenu/dapps-active.svg`)
              : require(`@/assets/images/sidemenu/dapps.svg`),
          title: self.$t('common.dapps')
        },
        {
          click: function() {
            self.toggle('openContract');
          },
          isActive:
            self.$route.path === '/interface/interact-with-contract' ||
            self.$route.path === '/interface/deploy-contract',
          iconSrc:
            self.$route.path === '/interface/interact-with-contract' ||
            self.$route.path === '/interface/deploy-contract'
              ? require(`@/assets/images/sidemenu/contract-active.svg`)
              : require(`@/assets/images/sidemenu/contract.svg`),
          title: self.$t('interface.txSideMenuContract'),
          caret: self.showContract,
          contents: [
            {
              itemActive:
                self.$route.path === '/interface/interact-with-contract',
              itemTitle: self.$t('common.interactWcontract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({
                  path: '/interface/interact-with-contract'
                });
              }
            },
            {
              itemActive: self.$route.path === '/interface/deploy-contract',
              itemTitle: self.$t('common.depContract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({ path: '/interface/deploy-contract' });
              }
            }
          ]
        },
        {
          click: function() {
            self.toggle('openMessage');
          },
          isActive:
            self.$route.path === '/interface/sign-message' ||
            self.$route.path === '/interface/verify-message',
          iconSrc:
            self.$route.path === '/interface/sign-message' ||
            self.$route.path === '/interface/verify-message'
              ? require(`@/assets/images/sidemenu/message-active.svg`)
              : require(`@/assets/images/sidemenu/message.svg`),
          title: self.$t('interface.txSideMenuMessage'),
          caret: self.showMessage,
          contents: [
            {
              itemActive: self.$route.path === '/interface/sign-message',
              itemTitle: self.$t('common.signMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({ path: '/interface/sign-message' });
              }
            },
            {
              itemActive: self.$route.path === '/interface/verify-message',
              itemTitle: self.$t('common.verifyMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.$router.push({ path: '/interface/verify-message' });
              }
            }
          ]
        }
      ];
    },
    toggle(param) {
      switch (param) {
        case 'openSend':
          this.showSend = !this.showSend;
          this.showContract = false;
          this.showMessage = false;
          break;
        case 'openContract':
          this.showSend = false;
          this.showContract = !this.showContract;
          this.showMessage = false;
          break;
        case 'openMessage':
          this.showSend = false;
          this.showContract = false;
          this.showMessage = !this.showMessage;
          break;
        default:
          this.showSend = false;
          this.showContract = false;
          this.showMessage = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
