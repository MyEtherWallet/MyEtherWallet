<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <div @click.prevent="toggle('openSend')" :class="[selectedTab === 'send' || selectedTab === 'offline' ? 'active' : '', 'menu-group-title']">
            <img :src="selectedTab === 'send' || selectedTab === 'offline'? require(`@/assets/images/sidemenu/send-active.svg`): require(`@/assets/images/sidemenu/send.svg`)"/>
            <p>{{ $t("interface.txSideMenuTitle") }}</p>
            <i :class="['fa', showSend ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i>
          </div>
          <ul v-show="showSend">
            <li @click.prevent="switchTabs('send')" :class="selectedTab === 'send'? 'active': ''">
              {{ $t("common.sendTx") }}
            </li>
            <li @click.prevent="switchTabs('offline')" :class="selectedTab === 'offline'? 'active': ''">
              {{ $t("common.offline") }}
            </li>
          </ul>
        </li>
        <li @click.prevent="switchTabs('swap')" >
          <div :class="[selectedTab === 'swap'? 'active': '', 'menu-group-title']">
            <img :src="selectedTab === 'swap'? require(`@/assets/images/sidemenu/swap-active.svg`): require(`@/assets/images/sidemenu/swap.svg`)"/>
            <p>
              {{ $t("common.swap") }}
            </p>
          </div>
        </li>
        <li @click.prevent="switchTabs('dapps')" >
          <div :class="[selectedTab === 'dapps'? 'active': '', 'menu-group-title']">
            <img :src="selectedTab === 'dapps'? require(`@/assets/images/sidemenu/dapps-active.svg`): require(`@/assets/images/sidemenu/dapps.svg`)"/>
            <p>
              {{ $t("common.dapps") }}
            </p>
          </div>
        </li>
        <li>
          <div @click.prevent="toggle('openContract')" :class="[selectedTab === 'interactC' || selectedTab === 'deployC' ? 'active' : '', 'menu-group-title']">
            <img :src="selectedTab === 'interactC' || selectedTab === 'deployC'? require(`@/assets/images/sidemenu/contract-active.svg`): require(`@/assets/images/sidemenu/contract.svg`)"/>
            <p>{{ $t("interface.txSideMenuContract") }}</p>
            <i :class="['fa', showContract ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i>
          </div>
          <ul v-show="showContract">
            <li @click.prevent="switchTabs('interactC')" :class="selectedTab === 'interactC'? 'active': ''">
              {{ $t("common.interactWcontract") }}
            </li>
            <li @click.prevent="switchTabs('deployC')" :class="selectedTab === 'deployC'? 'active': ''">
              {{ $t("common.depContract") }}
            </li>
          </ul>
        </li>
        <li>
          <div @click.prevent="toggle('openMessage')" :class="[selectedTab === 'signMessage' || selectedTab === 'verifyMessage' ? 'active' : '', 'menu-group-title']">
            <img :src="selectedTab === 'signMessage' || selectedTab === 'verifyMessage'? require(`@/assets/images/sidemenu/message-active.svg`): require(`@/assets/images/sidemenu/message.svg`)"/>
            <p>{{ $t("interface.txSideMenuMessage") }}</p>
            <i :class="['fa', showMessage ? 'fa-angle-up':'fa-angle-down']" aria-hidden="true"></i>
          </div>
          <ul v-show="showMessage">
            <li @click.prevent="switchTabs('signMessage')" :class="selectedTab === 'signMessage'? 'active': ''">
              {{ $t("common.signMessage") }}
            </li>
            <li @click.prevent="switchTabs('verifyMessage')" :class="selectedTab === 'verifyMessage'? 'active': ''">
              {{ $t("common.verifyMessage") }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from 'store'
export default {
  props: ['currentTab', 'switchTabs'],
  data () {
    return {
      selectedTab: this.currentTab,
      showSend: false,
      showContract: false,
      showMessage: false
    }
  },
  methods: {
    toggle (param) {
      switch (param) {
        case 'openSend':
          this.showSend = !this.showSend
          this.showContract = false
          this.showMessage = false
          break
        case 'openContract':
          this.showSend = false
          this.showContract = !this.showContract
          this.showMessage = false
          break
        case 'openMessage':
          this.showSend = false
          this.showContract = false
          this.showMessage = !this.showMessage
          break
        default:
          this.showSend = false
          this.showContract = false
          this.showMessage = false
          this.storePage(param)
      }
    },
    storePage (param) {
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param])
      store.set('sideMenu', param)
    }
  },
  watch: {
    currentTab (newVal) {
      this.selectedTab = newVal

      switch (newVal) {
        case 'send':
          this.showSend = true
          this.showContract = false
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'offline':
          this.showSend = true
          this.showContract = false
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'interactC':
          this.showSend = false
          this.showContract = true
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        case 'deployC':
          this.showSend = false
          this.showContract = true
          this.$store.dispatch('updatePageState', ['interface', 'sideMenu', newVal])
          store.set('sideMenu', newVal)
          break
        default:
          this.showSend = false
          this.showContract = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceSideMenu.scss";
</style>
