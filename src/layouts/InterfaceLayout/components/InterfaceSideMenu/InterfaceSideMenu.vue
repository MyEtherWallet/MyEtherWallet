<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <!-- <ul>
        <li @click.prevent="toggle('openSend')">
          <div
            :class="[currentTab === 'send' || currentTab === 'offline' ? 'active' : '', 'menu-group-title']">
            <img :src="currentTab === 'send' || currentTab === 'offline'? require(`@/assets/images/sidemenu/send-active.svg`): require(`@/assets/images/sidemenu/send.svg`)">
            <p>{{ $t("interface.txSideMenuTitle") }}</p>
            <i
              :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']"
              aria-hidden="true"/>
          </div>
          <ul v-show="showSend">
            <li
              :class="currentTab === 'send'? 'active': ''"
              @click.prevent="switchTabs('send')">
              {{ $t("common.sendTx") }}
            </li>
            <li
              :class="currentTab === 'offline'? 'active': ''"
              @click.prevent="switchTabs('offline')">
              {{ $t("common.offline") }}
            </li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" >
          <div :class="[currentTab === 'swap'? 'active': '', 'menu-group-title']">
            <img :src="currentTab === 'swap'? require(`@/assets/images/sidemenu/swap-active.svg`): require(`@/assets/images/sidemenu/swap.svg`)">
            <p>
              {{ $t("common.swap") }}
            </p>
          </div>
        </li>
        <li @click.prevent="switchTabs('dapps')" >
          <div :class="[currentTab === 'dapps'? 'active': '', 'menu-group-title']">
            <img :src="currentTab === 'dapps'? require(`@/assets/images/sidemenu/dapps-active.svg`): require(`@/assets/images/sidemenu/dapps.svg`)">
            <p>
              {{ $t("common.dapps") }}
            </p>
          </div>
        </li>
        <li @click.prevent="toggle('openContract')">
          <div
            :class="[currentTab === 'interactC' || currentTab === 'deployC' ? 'active' : '', 'menu-group-title']"
          >
            <img :src="currentTab === 'interactC' || currentTab === 'deployC'? require(`@/assets/images/sidemenu/contract-active.svg`): require(`@/assets/images/sidemenu/contract.svg`)">
            <p>{{ $t("interface.txSideMenuContract") }}</p>
            <i
              :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']"
              aria-hidden="true"/>
          </div>
          <ul v-show="showContract">
            <li
              :class="currentTab === 'interactC'? 'active': ''"
              @click.prevent="switchTabs('interactC')">
              {{ $t("common.interactWcontract") }}
            </li>
            <li
              :class="currentTab === 'deployC'? 'active': ''"
              @click.prevent="switchTabs('deployC')">
              {{ $t("common.depContract") }}
            </li>
          </ul>
        </li>
        <li @click.prevent="toggle('openMessage')">
          <div
            :class="[currentTab === 'signMessage' || currentTab === 'verifyMessage' ? 'active' : '', 'menu-group-title']"
            @click.prevent="toggle('openMessage')">
            <img :src="currentTab === 'signMessage' || currentTab === 'verifyMessage'? require(`@/assets/images/sidemenu/message-active.svg`): require(`@/assets/images/sidemenu/message.svg`)">
            <p>{{ $t("interface.txSideMenuMessage") }}</p>
            <i
              :class="['fa', showMessage ? 'fa-angle-up':'fa-angle-down']"
              aria-hidden="true"/>
          </div>
          <ul v-show="showMessage">
            <li
              :class="currentTab === 'signMessage'? 'active': ''"
              @click.prevent="switchTabs('signMessage')">
              {{ $t("common.signMessage") }}
            </li>
            <li
              :class="currentTab === 'verifyMessage'? 'active': ''"
              @click.prevent="switchTabs('verifyMessage')">
              {{ $t("common.verifyMessage") }}
            </li>
          </ul>
        </li>
      </ul> -->
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
import store from 'store';
export default {
  props: {
    currentTab: {
      type: String,
      default: ''
    },
    switchTabs: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    const self = this;
    return {
      showSend: false,
      showContract: false,
      showMessage: false,
      tabData: [
        {
          click: function() {
            self.toggle('openSend');
          },
          isActive: self.currentTab === 'send' || self.currentTab === 'offline',
          iconSrc:
            self.currentTab === 'send' || self.currentTab === 'offline'
              ? require(`@/assets/images/sidemenu/send-active.svg`)
              : require(`@/assets/images/sidemenu/send.svg`),
          title: self.$t('interface.txSideMenuTitle'),
          caret: self.showSend,
          contents: [
            {
              itemActive: self.currentTab === 'send',
              itemTitle: self.$t('common.sendTx'),
              itemClick: function() {
                self.switchTabs('send');
              }
            },
            {
              itemActive: self.currentTab === 'offline',
              itemTitle: self.$t('common.offline'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('offline');
              }
            }
          ]
        },
        {
          click: function() {
            self.switchTabs('swap');
          },
          isActive: self.currentTab === 'swap',
          iconSrc:
            self.currentTab === 'swap'
              ? require(`@/assets/images/sidemenu/swap-active.svg`)
              : require(`@/assets/images/sidemenu/swap.svg`),
          title: self.$t('common.swap')
        },
        {
          click: function() {
            self.switchTabs('dapps');
          },
          isActive: self.currentTab === 'dapps',
          iconSrc:
            self.currentTab === 'dapps'
              ? require(`@/assets/images/sidemenu/dapps-active.svg`)
              : require(`@/assets/images/sidemenu/dapps.svg`),
          title: self.$t('common.dapps')
        },
        {
          click: function() {
            self.toggle('openContract');
          },
          isActive:
            self.currentTab === 'interactC' || self.currentTab === 'deployC',
          iconSrc:
            self.currentTab === 'interactC' || self.currentTab === 'deployC'
              ? require(`@/assets/images/sidemenu/contract-active.svg`)
              : require(`@/assets/images/sidemenu/contract.svg`),
          title: self.$t('interface.txSideMenuContract'),
          caret: self.showContract,
          contents: [
            {
              itemActive: self.currentTab === 'interactC',
              itemTitle: self.$t('common.interactWcontract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('interactC');
              }
            },
            {
              itemActive: self.currentTab === 'deployC',
              itemTitle: self.$t('common.depContract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('deployC');
              }
            }
          ]
        },
        {
          click: function() {
            self.toggle('openMessage');
          },
          isActive:
            self.currentTab === 'signMessage' ||
            self.currentTab === 'verifyMessage',
          iconSrc:
            self.currentTab === 'signMessage' ||
            self.currentTab === 'verifyMessage'
              ? require(`@/assets/images/sidemenu/message-active.svg`)
              : require(`@/assets/images/sidemenu/message.svg`),
          title: self.$t('interface.txSideMenuMessage'),
          caret: self.showMessage,
          contents: [
            {
              itemActive: self.currentTab === 'signMessage',
              itemTitle: self.$t('common.signMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('signMessage');
              }
            },
            {
              itemActive: self.currentTab === 'verifyMessage',
              itemTitle: self.$t('common.verifyMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('verifyMessage');
              }
            }
          ]
        }
      ]
    };
  },
  watch: {
    currentTab(newVal) {
      this.updateTabData();
      switch (newVal) {
        case 'send':
          this.showSend = true;
          this.showContract = false;
          this.$store.dispatch('updatePageState', [
            'interface',
            'sideMenu',
            newVal
          ]);
          store.set('sideMenu', newVal);
          break;
        case 'offline':
          this.showSend = true;
          this.showContract = false;
          this.$store.dispatch('updatePageState', [
            'interface',
            'sideMenu',
            newVal
          ]);
          store.set('sideMenu', newVal);
          break;
        case 'interactC':
          this.showSend = false;
          this.showContract = true;
          this.$store.dispatch('updatePageState', [
            'interface',
            'sideMenu',
            newVal
          ]);
          store.set('sideMenu', newVal);
          break;
        case 'deployC':
          this.showSend = false;
          this.showContract = true;
          this.$store.dispatch('updatePageState', [
            'interface',
            'sideMenu',
            newVal
          ]);
          store.set('sideMenu', newVal);
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
    }
  },
  methods: {
    updateTabData() {
      const self = this;
      this.tabData = [
        {
          click: function() {
            self.toggle('openSend');
          },
          isActive: self.currentTab === 'send' || self.currentTab === 'offline',
          iconSrc:
            self.currentTab === 'send' || self.currentTab === 'offline'
              ? require(`@/assets/images/sidemenu/send-active.svg`)
              : require(`@/assets/images/sidemenu/send.svg`),
          title: self.$t('interface.txSideMenuTitle'),
          caret: self.showSend,
          contents: [
            {
              itemActive: self.currentTab === 'send',
              itemTitle: self.$t('common.sendTx'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('send');
              }
            },
            {
              itemActive: self.currentTab === 'offline',
              itemTitle: self.$t('common.offline'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('offline');
              }
            }
          ]
        },
        {
          click: function() {
            self.showSend = false;
            self.showContract = false;
            self.showMessage = false;
            self.switchTabs('swap');
          },
          isActive: self.currentTab === 'swap',
          iconSrc:
            self.currentTab === 'swap'
              ? require(`@/assets/images/sidemenu/swap-active.svg`)
              : require(`@/assets/images/sidemenu/swap.svg`),
          title: self.$t('common.swap')
        },
        {
          click: function() {
            self.showSend = false;
            self.showContract = false;
            self.showMessage = false;
            self.switchTabs('dapps');
          },
          isActive: self.currentTab === 'dapps',
          iconSrc:
            self.currentTab === 'dapps'
              ? require(`@/assets/images/sidemenu/dapps-active.svg`)
              : require(`@/assets/images/sidemenu/dapps.svg`),
          title: self.$t('common.dapps')
        },
        {
          click: function() {
            self.toggle('openContract');
          },
          isActive:
            self.currentTab === 'interactC' || self.currentTab === 'deployC',
          iconSrc:
            self.currentTab === 'interactC' || self.currentTab === 'deployC'
              ? require(`@/assets/images/sidemenu/contract-active.svg`)
              : require(`@/assets/images/sidemenu/contract.svg`),
          title: self.$t('interface.txSideMenuContract'),
          caret: self.showContract,
          contents: [
            {
              itemActive: self.currentTab === 'interactC',
              itemTitle: self.$t('common.interactWcontract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('interactC');
              }
            },
            {
              itemActive: self.currentTab === 'deployC',
              itemTitle: self.$t('common.depContract'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('deployC');
              }
            }
          ]
        },
        {
          click: function() {
            self.toggle('openMessage');
          },
          isActive:
            self.currentTab === 'signMessage' ||
            self.currentTab === 'verifyMessage',
          iconSrc:
            self.currentTab === 'signMessage' ||
            self.currentTab === 'verifyMessage'
              ? require(`@/assets/images/sidemenu/message-active.svg`)
              : require(`@/assets/images/sidemenu/message.svg`),
          title: self.$t('interface.txSideMenuMessage'),
          caret: self.showMessage,
          contents: [
            {
              itemActive: self.currentTab === 'signMessage',
              itemTitle: self.$t('common.signMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('signMessage');
              }
            },
            {
              itemActive: self.currentTab === 'verifyMessage',
              itemTitle: self.$t('common.verifyMessage'),
              itemClick: function(e) {
                e.cancelBubble = true;
                self.switchTabs('verifyMessage');
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
          this.switchTabs(param);
          this.storePage(param);
      }
    },
    storePage(param) {
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param]);
      store.set('sideMenu', param);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceSideMenu.scss';
</style>
