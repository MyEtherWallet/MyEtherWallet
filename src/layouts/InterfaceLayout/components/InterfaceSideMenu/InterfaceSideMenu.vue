<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <div 
            :class="[selectedTab === 'send' || selectedTab === 'offline' ? 'active' : '', 'menu-group-title']" 
            @click.prevent="toggle('openSend')">
            <img :src="selectedTab === 'send' || selectedTab === 'offline'? require(`@/assets/images/sidemenu/send-active.svg`): require(`@/assets/images/sidemenu/send.svg`)">
            <p>{{ $t("interface.txSideMenuTitle") }}</p>
            <i 
              :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']" 
              aria-hidden="true"/>
          </div>
          <ul v-show="showSend">
            <li 
              :class="selectedTab === 'send'? 'active': ''" 
              @click.prevent="switchTabs('send')">
              {{ $t("common.sendTx") }}
            </li>
            <li 
              :class="selectedTab === 'offline'? 'active': ''" 
              @click.prevent="switchTabs('offline')">
              {{ $t("common.offline") }}
            </li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" >
          <div :class="[selectedTab === 'swap'? 'active': '', 'menu-group-title']">
            <img :src="selectedTab === 'swap'? require(`@/assets/images/sidemenu/swap-active.svg`): require(`@/assets/images/sidemenu/swap.svg`)">
            <p>
              {{ $t("common.swap") }}
            </p>
          </div>
        </li>
        <li @click.prevent="switchTabs('dapps')" >
          <div :class="[selectedTab === 'dapps'? 'active': '', 'menu-group-title']">
            <img :src="selectedTab === 'dapps'? require(`@/assets/images/sidemenu/dapps-active.svg`): require(`@/assets/images/sidemenu/dapps.svg`)">
            <p>
              {{ $t("common.dapps") }}
            </p>
          </div>
        </li>
        <li>
          <div 
            :class="[selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : '', 'menu-group-title']" 
            @click.prevent="toggle('openContract')">
            <img :src="selectedTab === 'interactC' || selectedTab === 'deployC'? require(`@/assets/images/sidemenu/contract-active.svg`): require(`@/assets/images/sidemenu/contract.svg`)">
            <p>{{ $t("interface.txSideMenuContract") }}</p>
            <i 
              :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']" 
              aria-hidden="true"/>
          </div>
          <ul v-show="showContract">
            <li 
              :class="selectedTab === 'interactC'? 'active': ''" 
              @click.prevent="switchTabs('interactC')">
              {{ $t("common.interactWcontract") }}
            </li>
            <li 
              :class="selectedTab === 'deployC'? 'active': ''" 
              @click.prevent="switchTabs('deployC')">
              {{ $t("common.depContract") }}
            </li>
          </ul>
        </li>
        <li>
          <div 
            :class="[selectedTab === 'signMessage' || selectedTab === 'verifyMessage' ? 'active' : '', 'menu-group-title']" 
            @click.prevent="toggle('openMessage')">
            <img :src="selectedTab === 'signMessage' || selectedTab === 'verifyMessage'? require(`@/assets/images/sidemenu/message-active.svg`): require(`@/assets/images/sidemenu/message.svg`)">
            <p>{{ $t("interface.txSideMenuMessage") }}</p>
            <i 
              :class="['fa', showMessage ? 'fa-angle-up':'fa-angle-down']" 
              aria-hidden="true"/>
          </div>
          <ul v-show="showMessage">
            <li 
              :class="selectedTab === 'signMessage'? 'active': ''" 
              @click.prevent="switchTabs('signMessage')">
              {{ $t("common.signMessage") }}
            </li>
            <li 
              :class="selectedTab === 'verifyMessage'? 'active': ''" 
              @click.prevent="switchTabs('verifyMessage')">
              {{ $t("common.verifyMessage") }}
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
  props: ['currentTab', 'switchTabs'],
  data() {
    return {
      selectedTab: this.currentTab,
      showSend: false,
      showContract: false,
      showMessage: false
    };
  },
  watch: {
    currentTab(newVal) {
      this.selectedTab = newVal;

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
    }
  },
  methods: {
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
